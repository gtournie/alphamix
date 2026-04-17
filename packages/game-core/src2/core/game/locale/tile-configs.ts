import { TILE_BLANK } from "../const";
import type { LetterScore, TileInfo } from "../types";

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
  acc[locale] = {
    ...info,
    TILE_BAG_NEW_CONTENT: Object.keys(info.TILE_DISTRIBUTIONS).reduce((acc: string[], letter) => {
      for (let i = 0, len = info.TILE_DISTRIBUTIONS[letter]; i < len; ++i) acc.push(letter);
      return acc;
    }, [])
  };
  return acc;
}, {} as Record<string, TileInfo>);
