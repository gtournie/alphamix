import { describe, expect, it } from 'vitest';
import { TILE_INFO_BY_LOCALES } from './tile-configs';
import { SEPARATOR_ID } from '../const';
// Triggers the `zxx` alias side-effect registered on module load.
import '../__test-utils__/solver-fixtures';

describe('TILE_INFO_BY_LOCALES invariants', () => {
  it('ID_TO_CHAR places separator at SEPARATOR_ID and letters at 1..N', () => {
    const { ID_TO_CHAR } = TILE_INFO_BY_LOCALES.fr;
    expect(ID_TO_CHAR[SEPARATOR_ID]).toBe('+');
    expect(ID_TO_CHAR.length).toBe(27); // 1 separator + 26 letters
  });

  // Freezes the alphabet order. If this fails, every char_id baked into the GADDAG
  // binary is wrong at runtime — recompile the .bin or revert whatever changed
  // `sort` semantics (see the "don't use localeCompare" comment in tile-configs.ts).
  it('FR alphabet is A..Z sorted by UTF-16 code unit', () => {
    const expected = ['+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
      'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    expect(TILE_INFO_BY_LOCALES.fr.ID_TO_CHAR).toEqual(expected);
  });

  it('CHAR_TO_ID exposes letters only — no separator, no blank', () => {
    const { CHAR_TO_ID, ID_TO_CHAR } = TILE_INFO_BY_LOCALES.fr;
    expect(CHAR_TO_ID.size).toBe(ID_TO_CHAR.length - 1);
    expect(CHAR_TO_ID.get('+')).toBeUndefined();
    expect(CHAR_TO_ID.get('?')).toBeUndefined();
    expect(CHAR_TO_ID.get('A')).toBe(1);
    expect(CHAR_TO_ID.get('Z')).toBe(26);
  });

  it('CHAR_TO_ID is the inverse of ID_TO_CHAR over real letters', () => {
    const { CHAR_TO_ID, ID_TO_CHAR } = TILE_INFO_BY_LOCALES.fr;
    for (let i = 1, len = ID_TO_CHAR.length; i < len; i++) {
      expect(CHAR_TO_ID.get(ID_TO_CHAR[i])).toBe(i);
    }
  });

  // Aliasing zxx by REFERENCE (`zxx = fr` straight) would let a future field
  // replacement like `zxx.TILE_SCORES = {...}` silently corrupt fr. Shallow clone
  // (`zxx = { ...fr }`) gives us a distinct outer object. Inner objects are still
  // shared — that's accepted: nothing in the codebase mutates them in place.
  it('zxx test alias is a distinct object from fr but shares the same content', () => {
    expect(TILE_INFO_BY_LOCALES.zxx).not.toBe(TILE_INFO_BY_LOCALES.fr);
    expect(TILE_INFO_BY_LOCALES.zxx.ID_TO_CHAR).toEqual(TILE_INFO_BY_LOCALES.fr.ID_TO_CHAR);
    expect(TILE_INFO_BY_LOCALES.zxx.TILE_SCORES).toEqual(TILE_INFO_BY_LOCALES.fr.TILE_SCORES);
  });
});
