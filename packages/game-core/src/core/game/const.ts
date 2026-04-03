import { Bonuses, LetterScore } from "./types";
import { escapeRegexp } from "./utils/regex";

export const TILE_RACK_SIZE = 7;

export const BOARD_EMPTY_SQUARE = '.'; // one char only
export const TILE_BLANK = '?';

export const TILE_SCORE: LetterScore = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 10, L: 1, M: 2,
  N: 1, O: 1, P: 3, Q: 8, R: 1, S: 1, T: 1, U: 1, V: 4, W: 10, X: 10, Y: 10, Z: 10
};

export const TILE_DISTRIBUTION: Record<string, number> = {
  A: 9, B: 2, C: 2, D: 3, E: 15, F: 2, G: 2, H: 2, I: 8, J: 1, K: 1,
  L: 5, M: 3, N: 6, O: 6, P: 2, Q: 1, R: 6, S: 6, T: 6, U: 6, V: 2,
  W: 1, X: 1, Y: 1, Z: 1, [TILE_BLANK]: 2 // '?' represents blank tiles
};

export const TILE_BAG_NEW_CONTENT: string[] = Object.keys(TILE_DISTRIBUTION).reduce((acc: string[], letter) => {
  const length = TILE_DISTRIBUTION[letter];
  for (let i = 0; i < length; ++i) acc.push(letter);
  return acc;
}, []);

export const BOARD_SQUARE_BONUSES: Bonuses = {
  BLANK: { type: "", wordCoeff: 1, letterCoeff: 0, txt: "" },
  __: { type: "", wordCoeff: 1, letterCoeff: 1, txt: "" },
  W3: { type: "W3", wordCoeff: 3, letterCoeff: 1, txt: "MT" },
  W2: { type: "W2", wordCoeff: 2, letterCoeff: 1, txt: "MD" },
  L3: { type: "L3", wordCoeff: 1, letterCoeff: 3, txt: "LT" },
  L2: { type: "L2", wordCoeff: 1, letterCoeff: 2, txt: "LD" }
};
export const BINGO_BONUS = 50;

// - horizontal word
// | vertical word
// ! skip turn
export const HISTORY_DELIMITERS = {
  HORIZONTAL_WORD_TURN: '-',
  VERTICAL_WORD_TURN: '|',
  NON_PLAY_TURN: '!',
  FIRST_DRAW: '=',
};
export const HISTORY_DELIMITER_VALUES = Object.values(HISTORY_DELIMITERS).join('');
export const HISTORY_ENTRY_DRAW_SEPARATOR = ':';

export const HISTORY_ENTRY_SCAN_REG = (() => {
  const sep = escapeRegexp(HISTORY_DELIMITER_VALUES);
  return new RegExp(`[${sep}][^${sep}]*`, 'g');
})();

export const HISTORY_ENTRY_CHARS_REG = new RegExp(`^[${escapeRegexp(Object.keys(TILE_DISTRIBUTION).filter(c => c !== TILE_BLANK).join(''))}]*$`, 'i');
export const HISTORY_ENTRY_DRAW_REG = new RegExp(`^[${escapeRegexp(Object.keys(TILE_DISTRIBUTION).join(''))}]*$`);


// export const HISTORY_ALPHABET_WITH_BLANKS = Object.keys(TILE_DISTRIBUTION).join('') +
//   Object.values(HISTORY_DELIMITERS).join('') + HISTORY_ENTRY_DRAW_SEPARATOR;

// export const HISTORY_ALPHABET = HISTORY_ALPHABET_WITH_BLANKS.replace(TILE_BLANK, '');

// export const HISTORY_ENCODING_BITS_PER_CHAR = 5; // 32 symbols max (we use 31)

