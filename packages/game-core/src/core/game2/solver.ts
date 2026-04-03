import { BINGO_BONUS, BLANK_ID, BONUS_GRID, EMPTY_ID, INVERTED_BONUS_GRID, SEPARATOR_ID, TILE_RACK_SIZE } from "./const";
import LocaleData from "./LocaleData";
import { Bonus, CellConstraint, Move } from "./types";


export class Board {
  private vGrid: number[][];

  constructor(private localeData: LocaleData, private hGrid: number[][], private rack: number[]) {
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
        constraints.push({ isAnchor: false, mask: 0, verticalScore: 0 });
        continue;
      }

      // Check neighbors (with bounds safety)
      const hasVerticalNeighbor = (r > 0 && grid[r - 1][c] !== EMPTY_ID) ||
        (r < 14 && grid[r + 1][c] !== EMPTY_ID);

      const hasHorizontalNeighbor = (c > 0 && grid[r][c - 1] !== EMPTY_ID) ||
        (c < 14 && grid[r][c + 1] !== EMPTY_ID);

      const [mask, verticalScore] = hasVerticalNeighbor
        ? this.computeVerticalConstraint(grid, r, c)
        : [0xFFFFFFFF, 0];

      constraints.push({
        isAnchor: hasVerticalNeighbor || hasHorizontalNeighbor || r === 7 && c === 7,
        mask,
        verticalScore
      });
    }
    return constraints;
  }

  /**
   * Computes a bitmask of all letters that can be placed at (r, c)
   * to form a valid vertical word, and the score of existing tiles.
   * Returns [mask, verticalScore]
   */
  private computeVerticalConstraint(grid: number[][], r: number, c: number): [number, number] {
    const gaddag = this.localeData.gaddagData;
    const alphabet = this.localeData.alphabet;
    const scores = this.localeData.tileScores;
    let currentIdx = this.localeData.rootIdx;
    let verticalScore = 0;

    // Check left part of word
    let currR = r - 1;
    while (currR >= 0 && grid[currR][c] !== EMPTY_ID) {
      const charId = grid[currR][c];
      verticalScore += scores[alphabet[charId]] || 0;
      currentIdx = this.localeData.findDataChild(currentIdx, charId);
      currR--;
    }

    // If found left part, we check there's a separator next
    const hasLeftPart = currentIdx !== this.localeData.rootIdx;
    if (hasLeftPart) currentIdx = this.localeData.findDataChild(currentIdx, SEPARATOR_ID);

    // Check right part score
    currR = r + 1;
    while (currR < 15 && grid[currR][c] !== EMPTY_ID) {
      const charId = grid[currR++][c];
      verticalScore += scores[alphabet[charId]] || 0;
    }

    // Check every letter of the alphabet (except separator at index 0)
    let mask = 0;
    forLoop: for (let charId = 1, len = this.localeData.alphabetSize; charId < len; charId++) {
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
        mask |= (1 << charId);
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
      // for (let row = 11, len = grid.length; row < 12; row++) {
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

      // Skip if tile already on board
      if (grid[row][currentCol] !== EMPTY_ID) continue;

      // New tile placed
      const bonus = bonusGrid[row][currentCol];
      const letterScore = scores[word.charAt(i)] || 0;
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
        this.goRight(isVertical, moves, row, col + 1, nextNode, constraints, rack, word + this.localeData.alphabet[existingTile], usedLetters);
      }
      return;
    }

    // Try tiles from rack
    const rackLen = rack.length;
    const constraintMask = constraints[col].mask;

    for (let i = 0; i < rackLen; i++) {
      const charId = rack[i];
      const isBlank = charId === BLANK_ID;

      // If blank: try all letters (skip separator at 0), else: try only charId
      const startIdx = isBlank ? 1 : charId;
      const endIdx = isBlank ? this.localeData.alphabetSize : charId + 1;

      for (let targetCharId = startIdx; targetCharId < endIdx; targetCharId++) {
        if (!(constraintMask & (1 << targetCharId))) continue;

        const nextNodeIdx = this.localeData.findDataChild(nodeIdx, targetCharId);
        if (nextNodeIdx === -1) continue;

        // Manual rack copy - faster than spread
        const nextRack = new Array(rackLen - 1);
        for (let j = 0, k = 0; j < rackLen; j++) {
          if (j !== i) nextRack[k++] = rack[j];
        }

        const c = isBlank ? this.localeData.lowerAlphabet[targetCharId] : this.localeData.alphabet[targetCharId];
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
        this.goLeft(isVertical, moves, row, col - 1, nextNodeIdx, constraints, rack, this.localeData.alphabet[existingTile] + word, usedLetters, anchorCol);
      }
      return;
    }

    // Case B: The cell is empty, we try letters from our rack
    const rackLen = rack.length;
    const constraintMask = constraints[col].mask;

    for (let i = 0; i < rackLen; i++) {
      const charId = rack[i];
      const isBlank = charId === BLANK_ID;

      // If blank: try all letters (skip separator at 0), else: try only charId
      const startIdx = isBlank ? 1 : charId;
      const endIdx = isBlank ? this.localeData.alphabetSize : charId + 1;

      for (let targetCharId = startIdx; targetCharId < endIdx; targetCharId++) {
        if (!(constraintMask & (1 << targetCharId))) continue;

        const nextNodeIdx = this.localeData.findDataChild(nodeIdx, targetCharId);
        if (nextNodeIdx === -1) continue;

        // Manual rack copy - faster than spread
        const nextRack = new Array(rackLen - 1);
        for (let j = 0, k = 0; j < rackLen; j++) {
          if (j !== i) nextRack[k++] = rack[j];
        }

        const c = isBlank ? this.localeData.lowerAlphabet[targetCharId] : this.localeData.alphabet[targetCharId];
        this.goLeft(isVertical, moves, row, col - 1, nextNodeIdx, constraints, nextRack, c + word, c + usedLetters, anchorCol);
      }
    }
  }
}


