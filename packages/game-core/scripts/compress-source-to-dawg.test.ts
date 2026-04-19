import { describe, expect, it } from 'vitest';
import { compressToDawg, dawgContains } from './compress-source-to-dawg';
import { TILE_INFO_BY_LOCALES } from '../src2/core/game/locale/tile-configs';

describe('dawgContains', () => {
  const { CHAR_TO_ID } = TILE_INFO_BY_LOCALES.fr;

  it('matches dict words and rejects non-member queries on a real DAWG', () => {
    const dawg = compressToDawg(['CAB', 'CAS', 'CAT'], 'fr');
    expect(dawgContains(dawg, CHAR_TO_ID, 'CAB')).toBe(true);
    expect(dawgContains(dawg, CHAR_TO_ID, 'CAT')).toBe(true);
    expect(dawgContains(dawg, CHAR_TO_ID, 'CA')).toBe(false);
    expect(dawgContains(dawg, CHAR_TO_ID, 'CATS')).toBe(false);
    expect(dawgContains(dawg, CHAR_TO_ID, 'DOG')).toBe(false);
    expect(dawgContains(dawg, CHAR_TO_ID, '')).toBe(false);
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

    expect(dawgContains(dawg, CHAR_TO_ID, 'CAB')).toBe(true);
    expect(dawgContains(dawg, CHAR_TO_ID, 'CABS')).toBe(false);
    expect(dawgContains(dawg, CHAR_TO_ID, 'CABBB')).toBe(false);
  });
});
