import {
  BINGO_BONUS,
  BLANK_ID,
  BOARD_EMPTY_SQUARE,
  BONUS_GRID,
  EMPTY_ID,
  INVERTED_BONUS_GRID,
  SEPARATOR_ID,
  TILE_RACK_SIZE,
} from "./const";
import LocaleData from "./locale/locale-data";
import { Anchor, Bonus, Cell, EMPTY_MASK, Move } from "./types";

/**
 * Grid input convention:
 *   - `BOARD_EMPTY_SQUARE` ('.') for an empty square,
 *   - uppercase letter (e.g. 'A'..'Z') for a regular tile,
 *   - lowercase letter (e.g. 'a'..'z') for a blank tile previously placed as
 *     that letter — case is the only channel carrying blank-ness.
 */
export class Board {
  // Two fused grids of Cell (state + direction-specific constraint fields).
  // hGrid iterates horizontally (row-major), vGrid is its transpose for vertical
  // iteration. Each cell owns its own copy of the direction-specific fields
  // (mask / verticalScore) so the two grids never alias those.
  private hGrid: Cell[][];
  private vGrid: Cell[][];
  // Anchor coordinates per direction, collected once at construction. Lets
  // `findMovesInDirection` iterate only the ~30-60 anchors on a mid-game board
  // instead of scanning all 225 cells with a per-cell `isAnchor` check.
  private hAnchors: Anchor[] = [];
  private vAnchors: Anchor[] = [];

  // `localeData` is public-readonly so scripts (dump-solver-moves, test-solver)
  // can inspect the alphabet to format output without reaching through an
  // internal `private` field.
  constructor(
    public readonly localeData: LocaleData,
    grid: string[][],
    private rack: number[]
  ) {
    if (grid.length !== 15) {
      throw new Error(`Board grid must have 15 rows, got ${grid.length}`);
    }
    for (let r = 0; r < 15; r++) {
      if (grid[r].length !== 15) {
        throw new Error(`Board grid row ${r} must have 15 cells, got ${grid[r].length}`);
      }
    }

    // Phase 1: parse the raw string[][] into a base Cell[][] carrying only the
    // cell-state fields (char/charId/isBlank). Direction-specific fields are
    // filled with neutral defaults — they're overwritten in phase 2.
    this.hGrid = Board.createGrid((r, c) => this.parseCell(grid[r][c]));

    // Phase 2: compute H-direction masks / verticalScore and collect H-anchors.
    this.computeDirectionFields(this.hGrid, this.hAnchors);

    // Phase 3: build vGrid as the transpose, then compute V-direction fields.
    // Each V-cell gets a fresh object — direction-specific fields must stay
    // independent between the two grids.
    this.vGrid = Board.createGrid((r, c) => ({
      char: this.hGrid[c][r].char,
      charId: this.hGrid[c][r].charId,
      isBlank: this.hGrid[c][r].isBlank,
      mask: EMPTY_MASK,
      verticalScore: 0,
    }));
    this.computeDirectionFields(this.vGrid, this.vAnchors);
  }

  /**
   * Parses a single input character into the base cell-state fields. The two
   * direction-specific fields (mask / verticalScore) are filled later by
   * `computeDirectionFields`.
   */
  private parseCell(char: string): Cell {
    if (char === BOARD_EMPTY_SQUARE) {
      return {
        char: BOARD_EMPTY_SQUARE,
        charId: EMPTY_ID,
        isBlank: false,
        mask: EMPTY_MASK,
        verticalScore: 0,
      };
    }
    // Case is load-bearing: lowercase marks a pre-placed blank (scores 0).
    const isBlank = char !== char.toLocaleUpperCase(this.localeData.locale);
    const charId = this.localeData.charToId(char.toLocaleUpperCase(this.localeData.locale));
    return {
      char,
      charId,
      isBlank,
      mask: EMPTY_MASK,
      verticalScore: 0,
    };
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

  /**
   * For every empty cell in `grid`, compute `mask` / `verticalScore` for THIS
   * grid's iteration direction and write them back onto the Cell. Anchor cells
   * are appended to `anchors` so the solver can iterate them directly without
   * re-scanning the grid. Occupied cells keep the neutral defaults (never read
   * on the hot path).
   */
  private computeDirectionFields(grid: Cell[][], anchors: Anchor[]): void {
    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        const cell = grid[r][c];
        if (cell.charId !== EMPTY_ID) continue;

        // Neighbours: vertical = row above/below (perpendicular axis for cross-words);
        // horizontal = same-row left/right (hooks onto an existing word on this axis).
        const hasVerticalNeighbor =
          (r > 0 && grid[r - 1][c].charId !== EMPTY_ID) ||
          (r < 14 && grid[r + 1][c].charId !== EMPTY_ID);
        const hasHorizontalNeighbor =
          (c > 0 && grid[r][c - 1].charId !== EMPTY_ID) ||
          (c < 14 && grid[r][c + 1].charId !== EMPTY_ID);

        if (hasVerticalNeighbor) {
          const [mask, verticalScore] = this.computeVerticalMaskAndScore(grid, r, c);
          cell.mask = mask;
          cell.verticalScore = verticalScore;
        } else {
          // No perpendicular neighbour — every letter is allowed here. Alias the
          // shared "accept all" mask from LocaleData (immutable in practice).
          cell.mask = this.localeData.fullAlphabetMask;
          cell.verticalScore = 0;
        }

        if (hasVerticalNeighbor || hasHorizontalNeighbor || (r === 7 && c === 7)) {
          anchors.push({ row: r, col: c });
        }
      }
    }
  }

  /**
   * Computes a 0/1 mask indexed by charId, listing the letters that can be placed
   * at (r, c) to form a valid perpendicular word, and the combined score of the
   * existing pre-placed tiles on that axis. Returns [mask, verticalScore].
   *
   * A plain `number[]` is deliberate: V8 stores small-int arrays in a packed SMI
   * layout that benchmarks match (or beat) TypedArray for this size, and — unlike
   * a 32-bit bitmask — it scales to any alphabet we'd ever ship (Slovak → 42).
   */
  private computeVerticalMaskAndScore(grid: Cell[][], r: number, c: number): [number[], number] {
    const gaddag = this.localeData.gaddagData;
    const scores = this.localeData.tileScores;
    const alphabetSize = this.localeData.alphabetSize;
    let currentIdx = this.localeData.rootIdx;
    let verticalScore = 0;

    // Fresh mask per call, sliced from the pre-allocated all-zeros template on
    // LocaleData. `.slice()` is a single memcpy on a packed SMI array — faster
    // than `new Array(N).fill(0)` which allocates and iteratively writes.
    const mask = this.localeData.emptyAlphabetMask.slice();

    // Walk the left (above) part of the word. Bail on any lookup failure — no
    // placement is possible once the left context fails to form a valid GADDAG
    // reverse prefix. Pre-placed blanks are stored with a lowercase `char`
    // that misses the uppercase-only `scores` map → auto-0 via `|| 0`. The
    // GADDAG walk still uses their charId (the blank's letter).
    let currR = r - 1;
    while (currR >= 0 && grid[currR][c].charId !== EMPTY_ID) {
      const above = grid[currR][c];
      currentIdx = this.localeData.findDataChild(currentIdx, above.charId);
      if (currentIdx === -1) return [mask, verticalScore];
      verticalScore += scores[above.char] || 0;
      currR--;
    }

    // "We walked at least one letter" iff currR advanced past its starting value.
    // Only reachable on success: any failure inside the loop returned above.
    const hasLeftPart = currR < r - 1;
    if (hasLeftPart) {
      currentIdx = this.localeData.findDataChild(currentIdx, SEPARATOR_ID);
      if (currentIdx === -1) return [mask, verticalScore];
    }

    // Tally the right (below) part score (walk done below during mask check).
    currR = r + 1;
    while (currR < 15 && grid[currR][c].charId !== EMPTY_ID) {
      const below = grid[currR++][c];
      verticalScore += scores[below.char] || 0;
    }

    // Test every letter of the alphabet (skip separator at index 0).
    forLoop: for (let charId = 1; charId < alphabetSize; charId++) {
      let charIdx = this.localeData.findDataChild(currentIdx, charId);

      if (charIdx === -1) continue;
      if (!hasLeftPart) charIdx = this.localeData.findDataChild(charIdx, SEPARATOR_ID);

      // Walk the right part of the word.
      currR = r + 1;
      while (currR < 15 && grid[currR][c].charId !== EMPTY_ID) {
        charIdx = this.localeData.findDataChild(charIdx, grid[currR++][c].charId);
        if (charIdx === -1) continue forLoop;
      }

      // End-of-word check — inline bitshift on the packed node layout.
      if ((gaddag[charIdx] >>> 25) & 0x1) {
        mask[charId] = 1;
      }
    }
    return [mask, verticalScore];
  }

  /**
   * Main entry point: finds every legal move reachable from the current board
   * state and returns them keyed by `${WORD}${row}${dir}${col}`.
   */
  public moves(): Map<string, Move> {
    const moves = new Map<string, Move>();
    this.findMovesInDirection(false, moves);
    this.findMovesInDirection(true, moves);
    return moves;
  }

  /**
   * Processes a single orientation (horizontal, or vertical-via-transposition)
   * by walking the pre-built anchor list for that direction and triggering the
   * GADDAG search rooted at each.
   */
  private findMovesInDirection(isVertical: boolean, moves: Map<string, Move>): void {
    const grid = isVertical ? this.vGrid : this.hGrid;
    const anchors = isVertical ? this.vAnchors : this.hAnchors;

    for (let i = 0, len = anchors.length; i < len; i++) {
      const { row, col } = anchors[i];
      // Initially, we walk LEFT from the anchor.
      this.goLeft(isVertical, moves, row, col, this.localeData.rootIdx, grid[row], this.rack, "", "", col);
    }
  }

  private calculateScore(
    grid: Cell[][],
    bonusGrid: Bonus[][],
    cells: Cell[],
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
      const cell = grid[row][currentCol];
      // Lowercase chars (blanks — new or pre-placed) miss the uppercase-only
      // `scores` map and fall to 0 via the `|| 0` default. That alone makes
      // blank scoring work; we don't branch on `cell.isBlank` here.
      const letterScore = scores[word.charAt(i)] || 0;

      // Pre-placed tile: contributes its base letter score (no cell bonus).
      if (cell.charId !== EMPTY_ID) {
        horizontalScore += letterScore;
        continue;
      }

      // Newly placed tile: letter multiplier applies, word multiplier composes.
      const bonus = bonusGrid[row][currentCol];
      const tileScore = letterScore * bonus.letterCoeff;

      horizontalScore += tileScore;
      horizontalWordCoeff *= bonus.wordCoeff;

      // Cross-word score if there's an existing perpendicular run at this cell.
      const vertScore = cells[currentCol].verticalScore;
      if (vertScore > 0) {
        verticalScore += (vertScore + tileScore) * bonus.wordCoeff;
      }
    }

    horizontalScore *= horizontalWordCoeff;

    // Bingo bonus: all 7 rack tiles used in this move.
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
    cells: Cell[],
    rack: number[],
    word: string,
    usedLetters: string
  ): void {
    const grid = isVertical ? this.vGrid : this.hGrid;

    // 1. Emit a move if the current node is an end-of-word AND the next cell is
    // either past the edge or empty (we're not in the middle of a run).
    if ((this.localeData.gaddagData[nodeIdx] >>> 25) & 0x1 && (col >= 15 || grid[row][col].charId === EMPTY_ID)) {
      const startCol = col - word.length;
      const bonusGrid = isVertical ? INVERTED_BONUS_GRID : BONUS_GRID;
      const score = this.calculateScore(grid, bonusGrid, cells, word, row, startCol, usedLetters.length);

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

    const existingCell = grid[row][col];

    // Walk through a tile already on the board (preserves its original case in `word`).
    if (existingCell.charId !== EMPTY_ID) {
      const nextNode = this.localeData.findDataChild(nodeIdx, existingCell.charId);
      if (nextNode !== -1) {
        this.goRight(isVertical, moves, row, col + 1, nextNode, cells, rack, word + existingCell.char, usedLetters);
      }
      return;
    }

    // Try tiles from the rack.
    const rackLen = rack.length;
    const mask = existingCell.mask;

    for (let i = 0; i < rackLen; i++) {
      const charId = rack[i];
      const isBlank = charId === BLANK_ID;

      // Blank: try every letter (skip separator at 0); real tile: try only its charId.
      const startIdx = isBlank ? 1 : charId;
      const endIdx = isBlank ? this.localeData.alphabetSize : charId + 1;

      for (let targetCharId = startIdx; targetCharId < endIdx; targetCharId++) {
        if (!mask[targetCharId]) continue;

        const nextNodeIdx = this.localeData.findDataChild(nodeIdx, targetCharId);
        if (nextNodeIdx === -1) continue;

        // Manual rack copy — faster than spread.
        const nextRack = new Array(rackLen - 1);
        for (let j = 0, k = 0; j < rackLen; j++) {
          if (j !== i) nextRack[k++] = rack[j];
        }

        const c = isBlank ? this.localeData.lowerAlphabet[targetCharId] : this.localeData.upperAlphabet[targetCharId];
        this.goRight(isVertical, moves, row, col + 1, nextNodeIdx, cells, nextRack, word + c, usedLetters + c);
      }
    }
  }

  private goLeft(
    isVertical: boolean,
    moves: Map<string, Move>,
    row: number,
    col: number,
    nodeIdx: number,
    cells: Cell[],
    rack: number[],
    word: string,
    usedLetters: string,
    anchorCol: number
  ): void {
    const grid = isVertical ? this.vGrid : this.hGrid;

    // 1. Can we pivot to the right?
    const separatorIdx = this.localeData.findDataChild(nodeIdx, SEPARATOR_ID);
    if (separatorIdx !== -1 && (col < 0 || grid[row][col].charId === EMPTY_ID)) {
      this.goRight(isVertical, moves, row, anchorCol + 1, separatorIdx, cells, rack, word, usedLetters);
    }

    // 2. Can we continue going left?
    if (col < 0) return;

    const existingCell = grid[row][col];

    // Case A: pre-placed tile — use its charId to walk the GADDAG, preserve case in `word`.
    if (existingCell.charId !== EMPTY_ID) {
      const nextNodeIdx = this.localeData.findDataChild(nodeIdx, existingCell.charId);
      if (nextNodeIdx !== -1) {
        this.goLeft(isVertical, moves, row, col - 1, nextNodeIdx, cells, rack, existingCell.char + word, usedLetters, anchorCol);
      }
      return;
    }

    // Case B: empty cell — try each tile in the rack.
    const rackLen = rack.length;
    const mask = existingCell.mask;

    for (let i = 0; i < rackLen; i++) {
      const charId = rack[i];
      const isBlank = charId === BLANK_ID;

      const startIdx = isBlank ? 1 : charId;
      const endIdx = isBlank ? this.localeData.alphabetSize : charId + 1;

      for (let targetCharId = startIdx; targetCharId < endIdx; targetCharId++) {
        if (!mask[targetCharId]) continue;

        const nextNodeIdx = this.localeData.findDataChild(nodeIdx, targetCharId);
        if (nextNodeIdx === -1) continue;

        // Manual rack copy — faster than spread.
        const nextRack = new Array(rackLen - 1);
        for (let j = 0, k = 0; j < rackLen; j++) {
          if (j !== i) nextRack[k++] = rack[j];
        }

        const c = isBlank ? this.localeData.lowerAlphabet[targetCharId] : this.localeData.upperAlphabet[targetCharId];
        this.goLeft(isVertical, moves, row, col - 1, nextNodeIdx, cells, nextRack, c + word, c + usedLetters, anchorCol);
      }
    }
  }
}
