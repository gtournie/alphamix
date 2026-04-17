import { TILE_INFO_BY_LOCALES } from "./tile-configs";

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
      if ((nodeVal >>> 26) === targetCharId) return currentIdx;
      if (!(nodeVal & 0x1000000)) break;
      currentIdx++;
    }
    return -1;
  }
}
