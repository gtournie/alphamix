import { SEPARATOR_ID, TILE_BLANK } from "../const";
import type { LetterScore, TileInfo } from "../types";

const SEPARATOR = '+';

const tileInfoByLocales: Record<string, { TILE_SCORES: LetterScore; TILE_DISTRIBUTIONS: Record<string, number> }> = {
  fr: {
    TILE_SCORES: {
      A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 10, L: 1, M: 2,
      N: 1, O: 1, P: 3, Q: 8, R: 1, S: 1, T: 1, U: 1, V: 4, W: 10, X: 10, Y: 10, Z: 10
    },
    TILE_DISTRIBUTIONS: {
      A: 9, B: 2, C: 2, D: 3, E: 15, F: 2, G: 2, H: 2, I: 8, J: 1, K: 1,
      L: 5, M: 3, N: 6, O: 6, P: 2, Q: 1, R: 6, S: 6, T: 6, U: 6, V: 2,
      W: 1, X: 1, Y: 1, Z: 1, [TILE_BLANK]: 2
    }
  }
};

export const TILE_INFO_BY_LOCALES: Record<string, TileInfo> = Object.entries(tileInfoByLocales).reduce((acc, [locale, info]) => {
  // Default lexicographic sort compares by UTF-16 code unit and is spec-defined to be
  // deterministic across every ES runtime (V8, JSC, SpiderMonkey, Bun). Safe under
  // digraph tiles (ES "CH"/"LL", NL "IJ") since whole-string comparison yields
  // C < CH < D, I < IJ < J, etc. Do NOT use localeCompare: its output depends on the
  // host ICU version, which would desync char_ids between compression time and runtime.
  const letters = Object.keys(info.TILE_SCORES).sort();

  const idToCharMutable: string[] = new Array(letters.length + 1);
  idToCharMutable[SEPARATOR_ID] = SEPARATOR;
  for (let i = 0, len = letters.length; i < len; i++) idToCharMutable[i + 1] = letters[i];
  // Freeze so the `readonly string[]` type reflects a real runtime guarantee.
  // `LocaleData.upperAlphabet` aliases this array by reference — a hypothetical
  // `(upperAlphabet as string[])[0] = 'X'` would corrupt every future LocaleData
  // instance for the same locale. Freezing turns that silent corruption into a
  // TypeError (ESM modules run in strict mode).
  const ID_TO_CHAR: readonly string[] = Object.freeze(idToCharMutable);

  // CHAR_TO_ID exposes REAL letters only (no separator). The separator has its own
  // constant SEPARATOR_ID and should never be looked up by character — any code that
  // gets '+' via `CHAR_TO_ID.get('+')` is almost certainly a bug, and the undefined
  // return surfaces it instead of silently producing char_id 0.
  const CHAR_TO_ID = new Map<string, number>();
  for (let i = 1, len = ID_TO_CHAR.length; i < len; i++) CHAR_TO_ID.set(ID_TO_CHAR[i], i);

  acc[locale] = {
    ...info,
    TILE_BAG_NEW_CONTENT: Object.keys(info.TILE_DISTRIBUTIONS).reduce((acc: string[], letter) => {
      for (let i = 0, len = info.TILE_DISTRIBUTIONS[letter]; i < len; ++i) acc.push(letter);
      return acc;
    }, []),
    ID_TO_CHAR,
    CHAR_TO_ID
  };
  return acc;
}, {} as Record<string, TileInfo>);
