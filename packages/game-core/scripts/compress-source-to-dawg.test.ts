import { describe, expect, it } from 'vitest';
import { compressToDawg, dawgContains, resolveTokens } from './compress-source-to-dawg';
import { TILE_INFO_BY_LOCALES } from '../src2/core/game/locale/tile-configs';
// Importing registers `zxx-di` (digraph test locale) into TILE_INFO_BY_LOCALES.
import '../src2/core/game/__test-utils__/test-dict-digraph/build';

describe('dawgContains', () => {
  const { CHAR_TO_ID } = TILE_INFO_BY_LOCALES.fr;

  it('matches dict words and rejects non-member queries on a real DAWG', () => {
    const dawg = compressToDawg(['CAB', 'CAS', 'CAT'], 'fr');
    expect(dawgContains(dawg, CHAR_TO_ID, ['C', 'A', 'B'])).toBe(true);
    expect(dawgContains(dawg, CHAR_TO_ID, ['C', 'A', 'T'])).toBe(true);
    expect(dawgContains(dawg, CHAR_TO_ID, ['C', 'A'])).toBe(false);
    expect(dawgContains(dawg, CHAR_TO_ID, ['C', 'A', 'T', 'S'])).toBe(false);
    expect(dawgContains(dawg, CHAR_TO_ID, ['D', 'O', 'G'])).toBe(false);
    expect(dawgContains(dawg, CHAR_TO_ID, [])).toBe(false);
  });

  // Adversarial DAWG: dict = {CAB}, but data[0] (the estimatedGaddagNodes
  // header) is forged with bits that look like a legit node (charId=S, EOW=1).
  // Query "CABS" descends C → A → B (leaf, pointer=0) and, without the
  // leaf-pointer guard, the next iteration reads data[0] and interprets the
  // forged header as an S-node with EOW=1 — returning true for a word that
  // isn't in the dict. A real `compressToDawg` run never produces a header
  // whose top bits collide this way, but the guard documents the invariant
  // and makes `dawgContains` safe to call on buffers from any source.
  it('does not misinterpret the header as a node after a leaf descent', () => {
    const sId = CHAR_TO_ID.get('S')!;
    const cId = CHAR_TO_ID.get('C')!;
    const aId = CHAR_TO_ID.get('A')!;
    const bId = CHAR_TO_ID.get('B')!;

    // Node layout: [charId:6][eow:1][hasMore:1][pointer:24]
    const forgedHeader = ((sId << 26) | (1 << 25)) >>> 0;
    const dawg = new Uint32Array([
      forgedHeader,                                  // [0]: forged to match (S, EOW=1)
      ((cId << 26) | 2) >>> 0,                       // [1]: C → 2
      ((aId << 26) | 3) >>> 0,                       // [2]: A → 3
      ((bId << 26) | (1 << 25) | 0) >>> 0,           // [3]: B, EOW=1, leaf (ptr=0)
    ]);

    expect(dawgContains(dawg, CHAR_TO_ID, ['C', 'A', 'B'])).toBe(true);
    expect(dawgContains(dawg, CHAR_TO_ID, ['C', 'A', 'B', 'S'])).toBe(false);
    expect(dawgContains(dawg, CHAR_TO_ID, ['C', 'A', 'B', 'B', 'B'])).toBe(false);
  });
});

describe('resolveTokens', () => {
  const { ID_TO_CHAR } = TILE_INFO_BY_LOCALES['zxx-di'];
  const TILES = ID_TO_CHAR.slice(1);
  const TILE_SET = new Set(TILES);

  it('tokenizes a plain key greedily', () => {
    expect(resolveTokens('CHAT', TILE_SET, TILES)).toEqual({
      word: 'CHAT',
      tokens: ['CH', 'A', 'T'],
    });
  });

  it('takes a pre-tokenized key as-is (space-separated) and recovers the word', () => {
    expect(resolveTokens('C H A T', TILE_SET, TILES)).toEqual({
      word: 'CHAT',
      tokens: ['C', 'H', 'A', 'T'],
    });
  });

  it('throws on a pre-tokenized key with an unknown tile', () => {
    // "@" is not a tile in any locale's alphabet.
    expect(() => resolveTokens('C H @', TILE_SET, TILES)).toThrow(/unknown tile/i);
  });

  it('handles a pre-tokenized single-tile key', () => {
    expect(resolveTokens('CH', TILE_SET, TILES)).toEqual({
      word: 'CH',
      tokens: ['CH'],
    });
  });
});

describe('compressToDawg — pre-tokenized source keys', () => {
  const { CHAR_TO_ID } = TILE_INFO_BY_LOCALES['zxx-di'];

  it('stores a pre-tokenized override with the explicit token sequence, not the greedy one', () => {
    // In zxx-di, "CHAT" under greedy tokenizes as [CH, A, T] (3 tiles).
    // Pre-tokenized "C H A T" forces [C, H, A, T] (4 tiles) — a distinct DAWG path.
    const dawg = compressToDawg(['C H A T'], 'zxx-di');
    expect(dawgContains(dawg, CHAR_TO_ID, ['C', 'H', 'A', 'T'])).toBe(true);
    expect(dawgContains(dawg, CHAR_TO_ID, ['CH', 'A', 'T'])).toBe(false);
  });

  it('accepts a mixed dict where some words are greedy and others pre-tokenized', () => {
    // Both "CHAT" (greedy → [CH,A,T]) and "C H A T" (explicit → [C,H,A,T]) coexist.
    const dawg = compressToDawg(['CHAT', 'C H A T'], 'zxx-di');
    expect(dawgContains(dawg, CHAR_TO_ID, ['CH', 'A', 'T'])).toBe(true);
    expect(dawgContains(dawg, CHAR_TO_ID, ['C', 'H', 'A', 'T'])).toBe(true);
  });

  it('throws during compression when a pre-tokenized key has an unknown tile', () => {
    expect(() => compressToDawg(['C H A @'], 'zxx-di')).toThrow(/unknown tile/i);
  });
});
