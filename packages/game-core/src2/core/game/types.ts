
export interface CellConstraint {
  isAnchor: boolean;
  // Dense 0/1 array indexed by charId. `mask[charId]` truthy ⇒ letter is allowed
  // at this cell. Simpler and not-measurably-slower than a bitmask once the
  // alphabet exceeds 31 letters (where `1 << charId` silently wraps in JS).
  // Length = alphabetSize; index 0 (separator) is always 0.
  mask: number[];
  verticalScore: number; // Score of the vertical word already present (without bonuses)
}

export interface Move {
  word: string;
  usedLetters: string;
  score: number;
  row: number;
  col: number;
  dir: 'H' | 'V';
}

export type TileInfo = {
  TILE_SCORES: LetterScore;
  TILE_DISTRIBUTIONS: Record<string, number>;
  TILE_BAG_NEW_CONTENT: string[];
  // `readonly` is load-bearing: `LocaleData.upperAlphabet` aliases this array by
  // reference (no defensive copy). A mutation would corrupt every `LocaleData`
  // instance that binds to the same locale, silently desyncing char_ids from the
  // GADDAG binary.
  ID_TO_CHAR: readonly string[];
  CHAR_TO_ID: ReadonlyMap<string, number>;
};

export interface LetterScore {
  [key: string]: number;
}

export interface Bonus {
  type: string;
  wordCoeff: number;
  letterCoeff: number;
  txt: string;
}

export interface Bonuses {
  BLANK: Bonus;
  __: Bonus;
  W3: Bonus;
  W2: Bonus;
  L3: Bonus;
  L2: Bonus;
}
