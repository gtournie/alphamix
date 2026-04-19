import { BINGO_BONUS, BLANK_ID, BONUS_GRID, EMPTY_ID, INVERTED_BONUS_GRID, SEPARATOR_ID, TILE_RACK_SIZE } from "./const";
import LocaleData from "./locale/locale-data";
import { Bonus, CellConstraint, Move } from "./types";


export class Board {
  private vGrid: number[][];

  // `localeData` is public-readonly so scripts (dump-solver-moves, test-solver)
  // can inspect the alphabet to format output without reaching through an
  // internal `private` field. Everything the solver itself reads from it is
  // already readonly (upperAlphabet, lowerAlphabet, tileScores, …).
  constructor(public readonly localeData: LocaleData, private hGrid: number[][], private rack: number[]) {
    this.vGrid = Board.createGrid((row, col) => hGrid[col][row]);
  }

  static createGrid<T>(callback: (y: number, x: number) => T): T[][] {
    const newGrid: T[][] = new Array(15);
    for (let row = 0; row < 15; row++) {
      newGrid[row] = new Array(15);
      for (let col = 0; col < 15; col++) {
        newGrid[row][col] = callback(row, col);
      }
    }
    return newGrid;
  }

  private prepareRowConstraints(grid: number[][], r: number): CellConstraint[] {
    const constraints: CellConstraint[] = [];

    for (let c = 0; c < 15; c++) {
      const isOccupied = grid[r][c] !== EMPTY_ID;

      if (isOccupied) {
        // `EMPTY_MASK` would alias across all occupied cells — safe since nobody
        // writes to the cell's `mask` after this, but we keep one instance per
        // push to stay consistent with the "CellConstraint owns its mask" story.
        constraints.push({ isAnchor: false, mask: [], verticalScore: 0 });
        continue;
      }

      // Check neighbors (with bounds safety)
      const hasVerticalNeighbor = (r > 0 && grid[r - 1][c] !== EMPTY_ID) ||
        (r < 14 && grid[r + 1][c] !== EMPTY_ID);

      const hasHorizontalNeighbor = (c > 0 && grid[r][c - 1] !== EMPTY_ID) ||
        (c < 14 && grid[r][c + 1] !== EMPTY_ID);

      // No vertical neighbor ⇒ every letter is allowed. We alias a single shared
      // "accept all" array held on LocaleData (see `fullAlphabetMask`) so we don't
      // allocate one per cell — most cells in the early game hit this branch.
      const [mask, verticalScore] = hasVerticalNeighbor
        ? this.computeVerticalConstraint(grid, r, c)
        : [this.localeData.fullAlphabetMask, 0];

      constraints.push({
        isAnchor: hasVerticalNeighbor || hasHorizontalNeighbor || r === 7 && c === 7,
        mask,
        verticalScore
      });
    }
    return constraints;
  }

  /**
   * Computes a 0/1 mask indexed by charId, listing the letters that can be placed
   * at (r, c) to form a valid vertical word, and the score of existing tiles.
   * Returns [mask, verticalScore].
   *
   * A plain `number[]` is deliberate: V8 stores small-int arrays in a packed SMI
   * layout that benchmarks match (or beat) TypedArray for this size, and — unlike
   * a 32-bit bitmask — it scales to any alphabet we'd ever ship (Slovak → 42).
   */
  private computeVerticalConstraint(grid: number[][], r: number, c: number): [number[], number] {
    const gaddag = this.localeData.gaddagData;
    const alphabet = this.localeData.upperAlphabet;
    const scores = this.localeData.tileScores;
    const alphabetSize = this.localeData.alphabetSize;
    let currentIdx = this.localeData.rootIdx;
    let verticalScore = 0;

    // Fresh mask per call, sliced from the pre-allocated all-zeros template on
    // LocaleData. `.slice()` is a single memcpy on a packed SMI array — faster
    // than `new Array(N).fill(0)` which allocates and iteratively writes.
    const mask = this.localeData.emptyAlphabetMask.slice();

    // Check left part of word. Bail on any lookup failure — no placement is
    // possible once the left context fails to form a valid GADDAG reverse
    // prefix. Bailing directly (rather than `break` + post-loop recheck) also
    // avoids a subtle trap: a first-iter failure would leave `currR` at `r-1`,
    // making the post-loop `hasLeftPart = (currR < r - 1)` evaluate to false
    // while there IS a tile above — the mask still came out correct by luck
    // (via `Uint32Array[-1] === undefined` → -1), but the logic was lying
    // about the state of the world.
    let currR = r - 1;
    while (currR >= 0 && grid[currR][c] !== EMPTY_ID) {
      const charId = grid[currR][c];
      currentIdx = this.localeData.findDataChild(currentIdx, charId);
      if (currentIdx === -1) return [mask, verticalScore];
      verticalScore += scores[alphabet[charId]] || 0; // count only successful walks
      currR--;
    }

    // "We walked at least one letter" iff currR advanced past its starting
    // value. Only reachable on success: any failure inside the loop returned
    // above, so `currentIdx` here is guaranteed non-`-1`.
    const hasLeftPart = currR < r - 1;
    if (hasLeftPart) {
      currentIdx = this.localeData.findDataChild(currentIdx, SEPARATOR_ID);
      if (currentIdx === -1) return [mask, verticalScore];
    }

    // Check right part score
    currR = r + 1;
    while (currR < 15 && grid[currR][c] !== EMPTY_ID) {
      const charId = grid[currR++][c];
      verticalScore += scores[alphabet[charId]] || 0;
    }

    // Check every letter of the alphabet (except separator at index 0).
    forLoop: for (let charId = 1; charId < alphabetSize; charId++) {
      let charIdx = this.localeData.findDataChild(currentIdx, charId);

      if (charIdx === -1) continue;
      if (!hasLeftPart) charIdx = this.localeData.findDataChild(charIdx, SEPARATOR_ID);

      // check right part of word
      currR = r + 1;
      while (currR < 15 && grid[currR][c] !== EMPTY_ID) {
        charIdx = this.localeData.findDataChild(charIdx, grid[currR++][c]);
        if (charIdx === -1) continue forLoop;
      }

      // check end of word - inline bitshift
      if ((gaddag[charIdx] >>> 25) & 0x1) {
        mask[charId] = 1;
      }
    }
    return [mask, verticalScore];
  }

  /**
   * Main entry point to find all possible moves on the board.
   */
  public solve(): Map<string, Move> {
    const moves = new Map<string, Move>();
    this.solveDirection(false, moves);
    this.solveDirection(true, moves);
    return moves;
  }

  /**
   * Processes a single orientation (horizontal or vertical-transposed).
   * It prepares constraints and anchors in one pass, then triggers the search.
   */
  private solveDirection(isVertical: boolean, moves: Map<string, Move>): void {
    const grid = isVertical ? this.vGrid : this.hGrid;

    for (let row = 0, len = grid.length; row < len; row++) {
      const rowConstraints = this.prepareRowConstraints(grid, row);

      for (let c = 0, colCount = rowConstraints.length; c < colCount; c++) {
        const constraint = rowConstraints[c];

        if (constraint.isAnchor) {
          // Start the recursive search from the root of the GADDAG
          // Initially, we go left from the anchor
          this.goLeft(isVertical, moves, row, c, this.localeData.rootIdx, rowConstraints, this.rack, "", "", c);
        }
      }
    }
  }

  private calculateScore(
    grid: number[][],
    bonusGrid: Bonus[][],
    constraints: CellConstraint[],
    word: string,
    row: number,
    col: number,
    usedLettersCount: number
  ): number {

    const scores = this.localeData.tileScores;
    let horizontalScore = 0;
    let horizontalWordCoeff = 1;
    let verticalScore = 0;

    for (let i = 0, len = word.length; i < len; i++) {
      const currentCol = col + i;
      const letterScore = scores[word.charAt(i)] || 0;

      // Skip if tile already on board
      if (grid[row][currentCol] !== EMPTY_ID) {
        horizontalScore += letterScore;
        continue;
      }

      // New tile placed
      const bonus = bonusGrid[row][currentCol];
      const tileScore = letterScore * bonus.letterCoeff;

      horizontalScore += tileScore;
      horizontalWordCoeff *= bonus.wordCoeff;

      // Calculate vertical score if there are adjacent tiles
      const vertScore = constraints[currentCol].verticalScore;
      if (vertScore > 0) {
        verticalScore += (vertScore + tileScore) * bonus.wordCoeff;
      }
    }

    horizontalScore *= horizontalWordCoeff;

    // Add bingo bonus if all 7 tiles were used
    if (usedLettersCount === TILE_RACK_SIZE) {
      horizontalScore += BINGO_BONUS;
    }
    return horizontalScore + verticalScore;
  }

  private goRight(
    isVertical: boolean,
    moves: Map<string, Move>,
    row: number,
    col: number,
    nodeIdx: number,
    constraints: CellConstraint[],
    rack: number[],
    word: string,
    usedLetters: string
  ): void {
    const grid = isVertical ? this.vGrid : this.hGrid;

    // 1. Check if the current node endOfWord is true AND we used letters from rack
    if ((this.localeData.gaddagData[nodeIdx] >>> 25) & 0x1 && (col >= 15 || grid[row][col] === EMPTY_ID)) {
      const startCol = col - word.length;
      const bonusGrid = isVertical ? INVERTED_BONUS_GRID : BONUS_GRID;
      const score = this.calculateScore(grid, bonusGrid, constraints, word, row, startCol, usedLetters.length);

      const move = isVertical
        ? { word, usedLetters, score, row: startCol, col: row, dir: 'V' as const }
        : { word, usedLetters, score, row, col: startCol, dir: 'H' as const };

      const normalizedKey = `${move.word.toLocaleUpperCase(this.localeData.locale)}${move.row}${move.dir}${move.col}`;
      const existing = moves.get(normalizedKey);
      if (!existing || move.score > existing.score) {
        moves.set(normalizedKey, move);
      }
    }

    // 2. Can we continue going right?
    if (col >= 15) return;

    const existingTile = grid[row][col];

    // Use tile already on board
    if (existingTile !== EMPTY_ID) {
      const nextNode = this.localeData.findDataChild(nodeIdx, existingTile);
      if (nextNode !== -1) {
        this.goRight(isVertical, moves, row, col + 1, nextNode, constraints, rack, word + this.localeData.upperAlphabet[existingTile], usedLetters);
      }
      return;
    }

    // Try tiles from rack
    const rackLen = rack.length;
    const mask = constraints[col].mask;

    for (let i = 0; i < rackLen; i++) {
      const charId = rack[i];
      const isBlank = charId === BLANK_ID;

      // If blank: try all letters (skip separator at 0), else: try only charId
      const startIdx = isBlank ? 1 : charId;
      const endIdx = isBlank ? this.localeData.alphabetSize : charId + 1;

      for (let targetCharId = startIdx; targetCharId < endIdx; targetCharId++) {
        if (!mask[targetCharId]) continue;

        const nextNodeIdx = this.localeData.findDataChild(nodeIdx, targetCharId);
        if (nextNodeIdx === -1) continue;

        // Manual rack copy - faster than spread
        const nextRack = new Array(rackLen - 1);
        for (let j = 0, k = 0; j < rackLen; j++) {
          if (j !== i) nextRack[k++] = rack[j];
        }

        const c = isBlank ? this.localeData.lowerAlphabet[targetCharId] : this.localeData.upperAlphabet[targetCharId];
        this.goRight(isVertical, moves, row, col + 1, nextNodeIdx, constraints, nextRack, word + c, usedLetters + c);
      }
    }
  }

  private goLeft(
    isVertical: boolean,
    moves: Map<string, Move>,
    row: number,
    col: number,
    nodeIdx: number,
    constraints: CellConstraint[],
    rack: number[],
    word: string,
    usedLetters: string,
    anchorCol: number
  ): void {
    const grid = isVertical ? this.vGrid : this.hGrid;

    // 1. Can we pivot to the right?
    const separatorIdx = this.localeData.findDataChild(nodeIdx, SEPARATOR_ID);
    if (separatorIdx !== -1 && (col < 0 || grid[row][col] === EMPTY_ID)) {
      this.goRight(isVertical, moves, row, anchorCol + 1, separatorIdx, constraints, rack, word, usedLetters);
    }

    // 2. Can we continue going left?
    if (col < 0) return;

    const existingTile = grid[row][col];

    // Case A: There is already a tile on the board
    if (existingTile !== EMPTY_ID) {
      const nextNodeIdx = this.localeData.findDataChild(nodeIdx, existingTile);
      if (nextNodeIdx !== -1) {
        this.goLeft(isVertical, moves, row, col - 1, nextNodeIdx, constraints, rack, this.localeData.upperAlphabet[existingTile] + word, usedLetters, anchorCol);
      }
      return;
    }

    // Case B: The cell is empty, we try letters from our rack
    const rackLen = rack.length;
    const mask = constraints[col].mask;

    for (let i = 0; i < rackLen; i++) {
      const charId = rack[i];
      const isBlank = charId === BLANK_ID;

      // If blank: try all letters (skip separator at 0), else: try only charId
      const startIdx = isBlank ? 1 : charId;
      const endIdx = isBlank ? this.localeData.alphabetSize : charId + 1;

      for (let targetCharId = startIdx; targetCharId < endIdx; targetCharId++) {
        if (!mask[targetCharId]) continue;

        const nextNodeIdx = this.localeData.findDataChild(nodeIdx, targetCharId);
        if (nextNodeIdx === -1) continue;

        // Manual rack copy - faster than spread
        const nextRack = new Array(rackLen - 1);
        for (let j = 0, k = 0; j < rackLen; j++) {
          if (j !== i) nextRack[k++] = rack[j];
        }

        const c = isBlank ? this.localeData.lowerAlphabet[targetCharId] : this.localeData.upperAlphabet[targetCharId];
        this.goLeft(isVertical, moves, row, col - 1, nextNodeIdx, constraints, nextRack, c + word, c + usedLetters, anchorCol);
      }
    }
  }
}
