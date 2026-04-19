
// Fused grid cell: the state of a square (char / charId / isBlank) PLUS its
// direction-specific constraint fields (mask / verticalScore) used by the
// solver. A Board holds two Cell[][] — hGrid and vGrid (the transpose) — where
// the last two fields reflect that grid's iteration direction. Anchor
// eligibility is not stored per-cell: the Board keeps an explicit anchor list
// per direction to avoid re-scanning the full grid at solve time.
export interface Cell {
  // Input-preserving character at this cell. `BOARD_EMPTY_SQUARE` for an empty
  // square; uppercase `'A'..'Z'` for a regular tile; lowercase `'a'..'z'` for a
  // previously-placed blank — case is the only channel that carries blank-ness.
  char: string;
  // Numeric char_id used by the GADDAG navigation. `EMPTY_ID` when empty.
  charId: number;
  // True iff this cell was filled from a lowercase letter — flips letter scoring
  // to 0 for both the main word (if traversed) and vertical cross-words.
  isBlank: boolean;
  // Cross-word allow-list for THIS grid's direction. Aliased to EMPTY_MASK on
  // occupied cells (never read on the hot path).
  mask: number[];
  // Sum of base letter scores on the PERPENDICULAR axis (for scoring cross-words
  // when a new tile lands here). Blank neighbours contribute 0.
  verticalScore: number;
}

// Coordinates of an anchor cell in THIS grid's orientation (row/col in the
// corresponding Cell[][]).
export interface Anchor {
  row: number;
  col: number;
}

// Shared singleton for mask slots that will never be read (occupied cells).
// Aliasing avoids 225 fresh `[]` per Board ctor without risking mutation — the
// solver only reads masks on empty/anchor cells.
export const EMPTY_MASK: number[] = [];

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
