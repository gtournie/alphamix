import { TILE_INFO_BY_LOCALES } from "./tile-configs";
import { tokenizeTiles } from "./tokenize-tiles";

/**
 * Runtime wrapper around a GADDAG binary. Alphabet data comes entirely from
 * TILE_INFO_BY_LOCALES[locale] — the .bin file stores only nodes, no header.
 *
 * Layout invariants:
 *  - gaddag[0] = 0 (reserved sentinel). No real sibling entry lives at index 0,
 *    so a zero child-pointer in any serialized node unambiguously means "no
 *    children".
 *  - Root's children sibling chain starts at gaddag[1].
 *  - `rootIdx` is a pure sentinel tag (value 0), not a buffer index. Treating
 *    it as a tag — rather than as the actual position of root's first child —
 *    lets `findDataChild` distinguish "iterating root's children" from "walking
 *    a node that happens to sit at the same index as root's first child", which
 *    the solver relies on (see `computeVerticalConstraint`'s hasLeftPart logic
 *    and `goLeft`'s separator lookup).
 */
export default class LocaleData {
  public readonly rootIdx: number = 0;
  public readonly alphabetSize: number;
  public readonly lowerAlphabet: readonly string[];
  public readonly upperAlphabet: readonly string[];
  public readonly tileScores: Record<string, number>;
  // charId-indexed version of tileScores. Blanks (any charId placed from a
  // blank rack tile) score 0 — callers must zero the score out when the
  // placement was a blank; this table only knows the base letter value.
  // SEPARATOR_ID (0) is 0. Int32Array for cache-friendly indexed reads in
  // `calculateScore`'s hot loop.
  public readonly tileScoresByCharId: Int32Array;
  // upperAlphabet without the separator at index 0 — the actual set of legal
  // tiles. Used by `tokenize()` as the longest-match alphabet.
  public readonly upperTiles: readonly string[];
  public readonly tileBagNewContent: string[];
  // Pre-allocated "accept every letter" mask, shared across all cells without a
  // vertical neighbor. Most cells in the early game fall into this bucket — sharing
  // avoids a per-cell `new Array(alphabetSize).fill(1)` allocation on the hot path.
  // Index 0 (separator) stays 0: the solver's rack loop always starts at charId=1,
  // but a 0 there removes any chance that a stray `mask[0]` ever reads truthy.
  public readonly fullAlphabetMask: number[];
  // All-zeros template for `computeVerticalConstraint` to clone via `.slice()` —
  // a single memcpy in V8 is faster than `new Array(N).fill(0)`. Not shared as-is
  // (the caller mutates its copy), but the slice is cheaper than allocate+fill.
  public readonly emptyAlphabetMask: readonly number[];
  // Backing map for `charToId`. Private + typed `ReadonlyMap` so callers cannot
  // bypass the throw-on-unknown semantics by poking `.get()` directly.
  private readonly charToIdMap: ReadonlyMap<string, number>;

  constructor(public locale: string, public gaddagData: Uint32Array) {
    const tileInfo = TILE_INFO_BY_LOCALES[locale];
    if (!tileInfo) throw new Error(`No TILE_INFO for locale "${locale}"`);

    // ID_TO_CHAR is already uppercase (built from TILE_SCORES keys).
    // lowerAlphabet is derived — blanks render as lowercase.
    this.upperAlphabet = tileInfo.ID_TO_CHAR;
    this.alphabetSize = this.upperAlphabet.length;
    this.lowerAlphabet = this.upperAlphabet.map(c => c.toLocaleLowerCase(locale));

    this.tileScores = tileInfo.TILE_SCORES;
    this.tileBagNewContent = tileInfo.TILE_BAG_NEW_CONTENT;
    this.charToIdMap = tileInfo.CHAR_TO_ID;

    // Build the charId-indexed score table. Never mutated after construction.
    // `tileScores` is keyed by upper-case letter; charId 0 is the separator
    // (no score).
    const scoresByCharId = new Int32Array(this.alphabetSize);
    for (let i = 1; i < this.alphabetSize; i++) {
      scoresByCharId[i] = this.tileScores[this.upperAlphabet[i]] ?? 0;
    }
    this.tileScoresByCharId = scoresByCharId;
    this.upperTiles = this.upperAlphabet.slice(1);

    const fullMask = new Array<number>(this.alphabetSize).fill(1);
    fullMask[0] = 0;
    this.fullAlphabetMask = fullMask;
    this.emptyAlphabetMask = new Array<number>(this.alphabetSize).fill(0);

    this.validateBinaryMatchesAlphabet();
  }

  /**
   * Resolves a real alphabet letter to its char_id. Throws on any char that
   * isn't a known letter for this locale — callers that need to parse grid
   * placeholders (blank `?`, empty `.`/` `) must handle those BEFORE calling
   * here. Centralising the throw means every caller (scripts, tests, future
   * code) gets the same error shape instead of each re-inventing a
   * `CHAR_TO_ID.get(c) ?? throw` dance.
   */
  public charToId(c: string): number {
    const id = this.charToIdMap.get(c);
    if (id === undefined) {
      throw new Error(`Unknown char "${c}" (code ${c.charCodeAt(0)}) for locale "${this.locale}"`);
    }
    return id;
  }

  /**
   * Tokenises `word` into a sequence of charIds using greedy longest-match over
   * `upperTiles`. Assumes NFC/uppercase input — the caller (dict compiler,
   * TILE_INFO builder) owns validation at the data-ingestion boundary.
   */
  public tokenize(word: string): number[] {
    const tiles = tokenizeTiles(word, this.upperTiles);
    const out = new Array<number>(tiles.length);
    for (let i = 0, len = tiles.length; i < len; i++) {
      out[i] = this.charToId(tiles[i]);
    }
    return out;
  }

  /**
   * Cheap runtime shape-check: the GADDAG binary is header-less, so if
   * TILE_INFO_BY_LOCALES[locale] and `gaddagData` were built from different
   * alphabet configurations (someone edited tile-configs.ts without running
   * `scripts/compress-source-to-dawg.ts --force && compress-dawg-to-gaddag.ts --force`),
   * every `char_id` is off and the solver silently returns garbage moves.
   *
   * This walks root's sibling chain once at construction (cost: O(alphabetSize),
   * one-time) and asserts exactly the char_ids 1..alphabetSize-1 appear, each
   * exactly once. Catches: size drift (added/removed letters), char_id drift
   * (rejiggered sort), and binary corruption at the root level.
   *
   * Does NOT catch reorderings that preserve {1..alphabetSize-1} as a set (e.g.
   * two letters that happened to swap positions). For that we'd need to embed
   * the actual alphabet in the binary — a format change we deferred.
   */
  private validateBinaryMatchesAlphabet(): void {
    const gaddag = this.gaddagData;
    if (gaddag.length < 2) {
      throw new Error(`GADDAG binary for "${this.locale}" is too short (${gaddag.length} words) — expected at least the reserved sentinel + root's first child.`);
    }
    if (gaddag[0] !== 0) {
      throw new Error(`GADDAG binary for "${this.locale}" is missing the reserved-sentinel word at index 0 (found ${gaddag[0]}). The binary was built with an older format — regenerate with --force.`);
    }

    // Walk root's sibling chain at index 1 and collect the char_ids we see.
    // hasMoreSiblings is bit 24 of the packed node word.
    const seen = new Set<number>();
    let idx = 1;
    const maxIter = this.alphabetSize + 1; // +1 so an off-by-one overshoot is flagged
    for (let i = 0; i < maxIter; i++) {
      if (idx >= gaddag.length) {
        throw new Error(`GADDAG binary for "${this.locale}" truncated mid root-sibling-chain (index ${idx} >= length ${gaddag.length}).`);
      }
      const nodeVal = gaddag[idx];
      seen.add(nodeVal >>> 26);
      if (!(nodeVal & 0x1000000)) { // no more siblings
        idx++;
        break;
      }
      idx++;
    }

    const expectedLetters = this.alphabetSize - 1; // separator lives under each letter, not at root
    if (seen.size !== expectedLetters) {
      throw new Error(`GADDAG alphabet mismatch for "${this.locale}": binary has ${seen.size} distinct root char_ids, expected ${expectedLetters} (TILE_INFO_BY_LOCALES.${this.locale}.ID_TO_CHAR.length - 1). Regenerate the binary with \`bun run compress:all\`.`);
    }
    for (let expected = 1; expected <= expectedLetters; expected++) {
      if (!seen.has(expected)) {
        throw new Error(`GADDAG char_id ${expected} ("${this.upperAlphabet[expected]}") missing from root in binary for "${this.locale}". The binary was built from a different alphabet — regenerate with \`bun run compress:all\`.`);
      }
    }
  }

  /**
   * Returns the absolute index of the first child of `parentNodeIdx`, or 0 if
   * the node has no children. Same root-tag translation as `findDataChild`.
   * Exposed for the solver's blank-enumeration fast path, which walks a node's
   * entire child chain in one sweep and filters by cross-check mask — strictly
   * faster than N targeted `findDataChild` calls whenever more than one letter
   * of the alphabet is cross-check-legal at the cell (the common case).
   */
  public getChildChainHead(parentNodeIdx: number): number {
    return parentNodeIdx === this.rootIdx ? 1 : (this.gaddagData[parentNodeIdx] & 0xFFFFFF);
  }

  /**
   * Searches for a specific charId among the siblings of a node.
   * Uses the 24-bit pointer layout: [charId:6][eow:1][hasMore:1][pointer:24]
   */
  public findDataChild(parentNodeIdx: number, targetCharId: number): number {
    const gaddag = this.gaddagData;
    // Root is tagged, not positional: translate to the actual first-child index (1).
    let currentIdx = parentNodeIdx === this.rootIdx
      ? 1
      : gaddag[parentNodeIdx] & 0xFFFFFF;

    if (currentIdx === 0) return -1;

    while (true) {
      const nodeVal = gaddag[currentIdx];
      if ((nodeVal >>> 26) === targetCharId) return currentIdx;
      if (!(nodeVal & 0x1000000)) break;
      currentIdx++;
    }
    return -1;
  }
}
