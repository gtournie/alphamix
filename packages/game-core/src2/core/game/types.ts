
export interface CellConstraint {
  isAnchor: boolean;
  mask: number; // Bitmask where bit 0 is 'A', bit 1 is 'B', etc.
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
