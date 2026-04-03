import { TILE_BLANK } from "./const";
import { LetterScore, TileInfo } from "./types";

const tileInfoByLocales: Record<string, { TILE_SCORES: LetterScore; TILE_DISTRIBUTIONS: Record<string, number> }> = {
  fr: {
    TILE_SCORES: {
      A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 10, L: 1, M: 2,
      N: 1, O: 1, P: 3, Q: 8, R: 1, S: 1, T: 1, U: 1, V: 4, W: 10, X: 10, Y: 10, Z: 10
    },
    TILE_DISTRIBUTIONS: {
      A: 9, B: 2, C: 2, D: 3, E: 15, F: 2, G: 2, H: 2, I: 8, J: 1, K: 1,
      L: 5, M: 3, N: 6, O: 6, P: 2, Q: 1, R: 6, S: 6, T: 6, U: 6, V: 2,
      W: 1, X: 1, Y: 1, Z: 1, [TILE_BLANK]: 2 // '?' represents blank tiles
    }
  }
};

// iterate over tileInfoByLocales and add TILE_BAG_NEW_CONTENT
const TILE_INFO_BY_LOCALES: Record<string, TileInfo> = Object.entries(tileInfoByLocales).reduce((acc, [locale, info]) => {
  acc[locale] = {
    ...info,
    TILE_BAG_NEW_CONTENT: Object.keys(info.TILE_DISTRIBUTIONS).reduce((acc: string[], letter) => {
      for (let i = 0, len = info.TILE_DISTRIBUTIONS[letter]; i < len; ++i) acc.push(letter);
      return acc;
    }, [])
  };
  return acc;
}, {} as Record<string, TileInfo>);


export default class LocaleData {
  public readonly rootIdx: number;
  public readonly alphabetSize: number;
  public readonly alphabet: string[];
  public readonly lowerAlphabet: string[];
  public readonly upperAlphabet: string[];
  public readonly tileScores: Record<string, number>;
  public readonly tileBagNewContent: string[];

  constructor(public locale: string, public gaddagData: Uint32Array) {
    const alphabetLen = gaddagData[0];
    this.rootIdx = alphabetLen + 1;
    this.alphabetSize = alphabetLen;
    this.alphabet = new Array(alphabetLen);
    this.lowerAlphabet = new Array(alphabetLen);
    this.upperAlphabet = new Array(alphabetLen);
    for (let i = 0; i < alphabetLen; i++) {
      this.alphabet[i] = String.fromCharCode(gaddagData[i + 1]);
      this.lowerAlphabet[i] = this.alphabet[i].toLocaleLowerCase(this.locale);
      this.upperAlphabet[i] = this.alphabet[i].toLocaleUpperCase(this.locale);
    }

    const tileInfo = TILE_INFO_BY_LOCALES[locale];
    this.tileScores = tileInfo.TILE_SCORES;
    this.tileBagNewContent = tileInfo.TILE_BAG_NEW_CONTENT;
  }

  /**
   * Searches for a specific charId among the siblings of a node.
   * Uses the 24-bit pointer layout: [charId:6][eow:1][hasMore:1][pointer:24]
   */
  public findDataChild(parentNodeIdx: number, targetCharId: number): number {
    const gaddag = this.gaddagData;
    let currentIdx = parentNodeIdx === this.rootIdx
      ? parentNodeIdx
      : gaddag[parentNodeIdx] & 0xFFFFFF;

    if (currentIdx === 0) return -1;

    while (true) {
      const nodeVal = gaddag[currentIdx];
      // charId = (nodeVal >>> 26) & 0x3F
      if ((nodeVal >>> 26) === targetCharId) return currentIdx;
      // hasMore bit check optimisé (nodeVal >>> 24) & 0x1
      if (!(nodeVal & 0x1000000)) break;
      currentIdx++;
    }
    return -1;
  }
}