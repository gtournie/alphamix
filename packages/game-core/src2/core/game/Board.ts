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

  // Scratch buffers for the in-flight word during a `moves()` call. Indexed by
  // grid column; valid entries occupy [wordStart, wordStart+wordLen). Using
  // buffers instead of string concatenation in the recursion:
  //   * removes one ConsString allocation per placement (hot)
  //   * removes the two flatten operations previously paid on every emit
  //     (`word.charAt` in `calculateScore`, `toLocaleUpperCase` in the Map key)
  //   * lets `calculateScore` index a charId-keyed score table instead of a
  //     hashmap keyed by 1-char string
  // Backtracking is safe: siblings at the same recursion level write the same
  // columns — the later write erases the earlier, and no read spans the gap.
  // Re-used across `moves()` calls, assumed serial (the existing callers all
  // are). Fixed-size 15: board width.
  private readonly wordBuf = new Int8Array(15);
  private readonly isBlankBuf = new Uint8Array(15);
  private readonly isFromRackBuf = new Uint8Array(15);

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

    // Rack represented as a histogram (count per charId) plus a scalar blank
    // count. Two wins vs the previous `number[]`:
    //   1. Duplicate tiles (two '?' or e.g. 'AEES'→two 'E') are processed once
    //      per distinct letter, not once per position — the solver traversed
    //      identical sub-trees previously.
    //   2. No per-branch `new Array(rackLen - 1)` copy: goLeft/goRight mutate
    //      the histogram in place (dec → recurse → inc) as classical
    //      backtracking, and blankCount is a scalar copied by value per frame.
    // Symmetry of dec/inc around every recursion is a hard invariant — a
    // missed inc silently skews every subsequent placement attempt.
    const rack = this.rack;
    // `.slice()` on the pre-allocated zero-template is a single memcpy on a
    // packed SMI array — typically faster than `new Array(N).fill(0)` which
    // allocates + iteratively writes. Same template already used by
    // `computeVerticalMaskAndScore`. Benched iso vs `new Int8Array(N)` on FR
    // (27 entries); kept `number[]` for consistency with the cell masks.
    const histogram = this.localeData.emptyAlphabetMask.slice();
    let blankCount = 0;
    for (let i = 0, len = rack.length; i < len; i++) {
      const id = rack[i];
      if (id === BLANK_ID) blankCount++;
      else histogram[id]++;
    }
    const rackLen = rack.length;

    for (let i = 0, len = anchors.length; i < len; i++) {
      const { row, col } = anchors[i];
      // Initially, we walk LEFT from the anchor.
      this.goLeft(isVertical, moves, row, col, this.localeData.rootIdx, grid[row], histogram, blankCount, rackLen, 0, 0, false, col);
    }
  }

  private calculateScore(
    bonusGrid: Bonus[][],
    cells: Cell[],
    row: number,
    startCol: number,
    endCol: number,
    usedCount: number
  ): number {
    // Reads directly from the charId buffer: no string allocations, no
    // per-char hashmap lookup. `isBlankBuf` zeros the score for blanks
    // (whether pre-placed or just placed) — uniform across both cases, so
    // no branch on pre-placed status for the letter score.
    const scores = this.localeData.tileScoresByCharId;
    const wordBuf = this.wordBuf;
    const isBlankBuf = this.isBlankBuf;
    const isFromRackBuf = this.isFromRackBuf;

    let horizontalScore = 0;
    let horizontalWordCoeff = 1;
    let verticalScore = 0;

    for (let p = startCol; p < endCol; p++) {
      const letterScore = isBlankBuf[p] ? 0 : scores[wordBuf[p]];

      // Pre-placed tile: contributes its base letter score (no cell bonus).
      if (!isFromRackBuf[p]) {
        horizontalScore += letterScore;
        continue;
      }

      // Newly placed tile: letter multiplier applies, word multiplier composes.
      const bonus = bonusGrid[row][p];
      const tileScore = letterScore * bonus.letterCoeff;

      horizontalScore += tileScore;
      horizontalWordCoeff *= bonus.wordCoeff;

      // Cross-word score if there's an existing perpendicular run at this cell.
      const vertScore = cells[p].verticalScore;
      if (vertScore > 0) {
        verticalScore += (vertScore + tileScore) * bonus.wordCoeff;
      }
    }

    horizontalScore *= horizontalWordCoeff;

    // Bingo bonus: all 7 rack tiles used in this move.
    if (usedCount === TILE_RACK_SIZE) {
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
    histogram: number[],
    blankCount: number,
    rackLen: number,
    wordLen: number,
    usedCount: number,
    hasWordBlank: boolean
  ): void {
    // Hoist hot fields — see comment on wordBuf/isBlankBuf/isFromRackBuf above.
    const ld = this.localeData;
    const gaddag = ld.gaddagData;
    const wordBuf = this.wordBuf;
    const isBlankBuf = this.isBlankBuf;
    const isFromRackBuf = this.isFromRackBuf;

    // 1. Emit a move if the current node is an end-of-word AND the next cell is
    // either past the edge or empty (we're not in the middle of a run).
    if ((gaddag[nodeIdx] >>> 25) & 0x1 && (col >= 15 || cells[col].charId === EMPTY_ID)) {
      const startCol = col - wordLen;
      const bonusGrid = isVertical ? INVERTED_BONUS_GRID : BONUS_GRID;
      const score = this.calculateScore(bonusGrid, cells, row, startCol, col, usedCount);

      // Fast-path dedup: `word` / `keyWord` / `usedLetters` often coincide.
      //   - `keyWord === word` when the word contains no blank (rack or pre-
      //     placed), because `word` is then fully uppercase → `wordBlankCount`
      //     scalar tracks this.
      //   - `usedLetters === word` when every character came from the rack
      //     (no pre-placed walk contributed a char) → `usedCount === wordLen`.
      // When both hold, build a single string; otherwise build only what's
      // missing via `String.fromCharCode(...codes)` spread (one C-level call
      // per string).
      const upperCodesTbl = ld.upperCharCodeByCharId;
      const wordCodes = new Array<number>(wordLen);
      const needKey = hasWordBlank;
      const needUsed = usedCount !== wordLen;
      const keyCodes = needKey ? new Array<number>(wordLen) : wordCodes;
      const usedCodes = needUsed ? new Array<number>(usedCount) : wordCodes;
      if (needKey || needUsed) {
        const lowerCodesTbl = ld.lowerCharCodeByCharId;
        let usedIdx = 0;
        for (let p = startCol, w = 0; p < col; p++, w++) {
          const cid = wordBuf[p];
          const upperCode = upperCodesTbl[cid];
          if (needKey) keyCodes[w] = upperCode;
          if (isBlankBuf[p]) {
            const lowerCode = lowerCodesTbl[cid];
            wordCodes[w] = lowerCode;
            if (needUsed && isFromRackBuf[p]) usedCodes[usedIdx++] = lowerCode;
          } else {
            wordCodes[w] = upperCode;
            if (needUsed && isFromRackBuf[p]) usedCodes[usedIdx++] = upperCode;
          }
        }
      } else {
        // No blanks AND every char from rack → word = keyWord = usedLetters.
        for (let p = startCol, w = 0; p < col; p++, w++) {
          wordCodes[w] = upperCodesTbl[wordBuf[p]];
        }
      }
      const word = String.fromCharCode(...wordCodes);
      const keyWord = needKey ? String.fromCharCode(...keyCodes) : word;
      const usedLetters = needUsed ? String.fromCharCode(...usedCodes) : word;

      const move = isVertical
        ? { word, usedLetters, score, row: startCol, col: row, dir: 'V' as const }
        : { word, usedLetters, score, row, col: startCol, dir: 'H' as const };

      // Pack (row, col, dir) into a 9-bit int appended to the all-uppercase
      // keyWord. Unambiguous because keyWord is pure uppercase letters (never
      // digits), so the digit suffix parses unambiguously. Replaces the 4-part
      // template literal (2 number→string coercions + 3 concats) with 1
      // coercion + 1 concat.
      const posNum = move.row * 32 + move.col * 2 + (isVertical ? 1 : 0);
      const normalizedKey = keyWord + posNum;
      const existing = moves.get(normalizedKey);
      if (!existing || move.score > existing.score) {
        moves.set(normalizedKey, move);
      }
    }

    // 2. Can we continue going right?
    if (col >= 15) return;

    const existingCell = cells[col];

    // Walk through a tile already on the board.
    if (existingCell.charId !== EMPTY_ID) {
      const nextNode = ld.findDataChild(nodeIdx, existingCell.charId);
      if (nextNode !== -1) {
        wordBuf[col] = existingCell.charId;
        const cellIsBlank = existingCell.isBlank;
        isBlankBuf[col] = cellIsBlank ? 1 : 0;
        isFromRackBuf[col] = 0;
        this.goRight(isVertical, moves, row, col + 1, nextNode, cells, histogram, blankCount, rackLen, wordLen + 1, usedCount, hasWordBlank || cellIsBlank);
      }
      return;
    }

    // Empty cell — single pass over the GADDAG node's children, trying each
    // as a real rack tile (if `histogram[childCharId] > 0`) and/or a blank
    // (if `blankCount > 0`). See rationale on the unified walk in the
    // previous revision's comment block.
    // Separator (charId 0) can never be a placement: mask[0] is 0 by
    // construction, but we guard explicitly for robustness.
    // Loop exit via `curIdx = 0` when hasMore (bit 24) is unset — a single
    // condition on the `while` instead of an inner `break`.
    const mask = existingCell.mask;
    let curIdx = ld.getChildChainHead(nodeIdx);
    if (curIdx !== 0) {
      isFromRackBuf[col] = 1;
      let hasMore = true;
      do {
        const nv = gaddag[curIdx];
        const childCharId = nv >>> 26;
        if (childCharId !== SEPARATOR_ID && mask[childCharId]) {
          wordBuf[col] = childCharId;
          // Real tile first (score-preserving).
          if (histogram[childCharId] > 0) {
            histogram[childCharId]--;
            isBlankBuf[col] = 0;
            this.goRight(isVertical, moves, row, col + 1, curIdx, cells, histogram, blankCount, rackLen - 1, wordLen + 1, usedCount + 1, hasWordBlank);
            histogram[childCharId]++;
          }
          // Then as a blank — same GADDAG path, zero letter score.
          if (blankCount > 0) {
            blankCount--;
            isBlankBuf[col] = 1;
            this.goRight(isVertical, moves, row, col + 1, curIdx, cells, histogram, blankCount, rackLen - 1, wordLen + 1, usedCount + 1, true);
            blankCount++;
          }
        }
        hasMore = (nv & 0x1000000) !== 0;
        curIdx++;
      } while (hasMore);
    }
  }

  private goLeft(
    isVertical: boolean,
    moves: Map<string, Move>,
    row: number,
    col: number,
    nodeIdx: number,
    cells: Cell[],
    histogram: number[],
    blankCount: number,
    rackLen: number,
    wordLen: number,
    usedCount: number,
    hasWordBlank: boolean,
    anchorCol: number
  ): void {
    // Hoist hot fields — see rationale in goRight.
    const ld = this.localeData;
    const gaddag = ld.gaddagData;
    const wordBuf = this.wordBuf;
    const isBlankBuf = this.isBlankBuf;
    const isFromRackBuf = this.isFromRackBuf;

    // 1. Can we pivot to the right?
    const separatorIdx = ld.findDataChild(nodeIdx, SEPARATOR_ID);
    if (separatorIdx !== -1 && (col < 0 || cells[col].charId === EMPTY_ID)) {
      this.goRight(isVertical, moves, row, anchorCol + 1, separatorIdx, cells, histogram, blankCount, rackLen, wordLen, usedCount, hasWordBlank);
    }

    // 2. Can we continue going left?
    if (col < 0) return;

    const existingCell = cells[col];

    // Case A: pre-placed tile — walk the GADDAG with its charId.
    if (existingCell.charId !== EMPTY_ID) {
      const nextNodeIdx = ld.findDataChild(nodeIdx, existingCell.charId);
      if (nextNodeIdx !== -1) {
        wordBuf[col] = existingCell.charId;
        const cellIsBlank = existingCell.isBlank;
        isBlankBuf[col] = cellIsBlank ? 1 : 0;
        isFromRackBuf[col] = 0;
        this.goLeft(isVertical, moves, row, col - 1, nextNodeIdx, cells, histogram, blankCount, rackLen, wordLen + 1, usedCount, hasWordBlank || cellIsBlank, anchorCol);
      }
      return;
    }

    // Case B: empty cell — unified child-chain walk (see rationale in goRight).
    const mask = existingCell.mask;
    let curIdx = ld.getChildChainHead(nodeIdx);
    if (curIdx !== 0) {
      isFromRackBuf[col] = 1;
      let hasMore = true;
      do {
        const nv = gaddag[curIdx];
        const childCharId = nv >>> 26;
        if (childCharId !== SEPARATOR_ID && mask[childCharId]) {
          wordBuf[col] = childCharId;
          if (histogram[childCharId] > 0) {
            histogram[childCharId]--;
            isBlankBuf[col] = 0;
            this.goLeft(isVertical, moves, row, col - 1, curIdx, cells, histogram, blankCount, rackLen - 1, wordLen + 1, usedCount + 1, hasWordBlank, anchorCol);
            histogram[childCharId]++;
          }
          if (blankCount > 0) {
            blankCount--;
            isBlankBuf[col] = 1;
            this.goLeft(isVertical, moves, row, col - 1, curIdx, cells, histogram, blankCount, rackLen - 1, wordLen + 1, usedCount + 1, true, anchorCol);
            blankCount++;
          }
        }
        hasMore = (nv & 0x1000000) !== 0;
        curIdx++;
      } while (hasMore);
    }
  }
}
