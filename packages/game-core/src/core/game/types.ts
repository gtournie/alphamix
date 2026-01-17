import { HISTORY_DELIMITERS } from "./const";

export interface PlayerTile {
  char: string;
  x: number;
  y: number;
}

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

export interface GridTile {
  isEmpty: boolean;
  bonus: Bonus;
  isBlank: boolean;
  value: string;
  tileChar: string;
  code: number;
  valid: boolean;
  top: string;
  right: string;
  bottom: string;
  left: string;
  validWordWith: number;
  verticalScore: number;
}

export interface NodeGridTile {
  leftNode: NodeGridTile | null;
  rightNode: NodeGridTile | null;
  topNode: NodeGridTile | null;
  bottomNode: NodeGridTile | null;
}

export interface ValidationResult {
  valid: boolean;
  error?: 'notConnected' | 'invalidWords' | 'emptyCenter';
  invalidWords?: string[]
}

export interface Coord {
  x: number;
  y: number;
}

interface WordSpan {
  valid: boolean;
  word: string;
  coords: Coord[];
}

export type CheckLettersError = 'noTilesGiven' | 'notConnected' | 'notInline' | 'floating' | 'invalidWord' | 'invalidCrossWord' | 'wordTooShort' | 'invalidFirstMove';

// interface CheckLettersUnprocessableResult {
//   valid: false;
//   error: 'noTilesGiven' | 'notConnected' | 'notInline'
// }

// interface CheckLettersCommonResult {
//   score: number;
//   wordSpan: WordSpan;
//   crossWordSpans: WordSpan[]
// }

// export interface CheckLettersKoResult extends CheckLettersCommonResult {
//   valid: false;
//   error: 'floating' | 'invalidWord' | 'invalidCrossWord' | 'wordTooShort' | 'invalidFirstMove';
// }

// export interface CheckLettersOkResult extends CheckLettersCommonResult {
//   valid: true;
//   error: null;
// }

// export type CheckLettersResult = CheckLettersUnprocessableResult | CheckLettersKoResult | CheckLettersOkResult;

export interface CheckLettersResult {
  valid: boolean;
  errors: Partial<Record<CheckLettersError, true>>;
  score?: number;
  wordSpan?: WordSpan;
  crossWordSpans?: WordSpan[],
  entry?: string,
  horizontal?: boolean
}

export interface PlayWordResult {
  valid: true;
  errors: object;
  score: number;
  wordSpan: WordSpan;
  crossWordSpans: WordSpan[]
}

export interface WordResult {
  x: number;
  y: number;
  word: string;
  count: number;
  dir: 'ltr' | 'ttb';
  score: number;
}

export interface Combinations {
  strict: [string, string][];
  incomplete: [string, string][];
}

export type AlphaCombinations = string[][];

export type HistorySymbol = typeof HISTORY_DELIMITERS[keyof typeof HISTORY_DELIMITERS];