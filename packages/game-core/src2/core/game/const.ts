import { Bonuses, LetterScore, TileInfo } from "./types";

export const SEPARATOR_ID = 0; // Assuming the separator is the first character in the alphabet
export const EMPTY_ID = -1;
export const BLANK_ID = -2; // ID for blank tiles (jokers) in the rack

export const TILE_RACK_SIZE = 7;

// Maximum supported alphabet size (letters + separator). Sizes the static
// lookup tables in `wasm/gaddag_converter.c` (node_templates, separator_nodes,
// last_split_* caches). Currently 43 = Slovak (42 letters) + separator.
// MUST stay in sync with the `#define MAX_ALPHABET` at the top of that file —
// bumping only one side creates a silent mismatch: the TS wrapper would accept
// an input the C rejects (or vice-versa) with no clear error.
export const MAX_ALPHABET = 43;

export const BOARD_EMPTY_SQUARE = '.'; // one char only
export const TILE_BLANK = '?'

export const BOARD_SQUARE_BONUSES: Bonuses = {
  BLANK: { type: "", wordCoeff: 1, letterCoeff: 0, txt: "" },
  __: { type: "", wordCoeff: 1, letterCoeff: 1, txt: "" },
  W3: { type: "W3", wordCoeff: 3, letterCoeff: 1, txt: "MT" },
  W2: { type: "W2", wordCoeff: 2, letterCoeff: 1, txt: "MD" },
  L3: { type: "L3", wordCoeff: 1, letterCoeff: 3, txt: "LT" },
  L2: { type: "L2", wordCoeff: 1, letterCoeff: 2, txt: "LD" }
};
export const BINGO_BONUS = 50;

export const BONUS_GRID = (function ({ __, W3, W2, L3, L2 }: Bonuses) {
  return [
    //0   1   2   3   4   5   6   7   8   9  10  11  12  13  14 
    [W3, __, __, L2, __, __, __, W3, __, __, __, L2, __, __, W3], // 0
    [__, W2, __, __, __, L3, __, __, __, L3, __, __, __, W2, __], // 1
    [__, __, W2, __, __, __, L2, __, L2, __, __, __, W2, __, __], // 2
    [L2, __, __, W2, __, __, __, L2, __, __, __, W2, __, __, L2], // 3
    [__, __, __, __, W2, __, __, __, __, __, W2, __, __, __, __], // 4
    [__, L3, __, __, __, L3, __, __, __, L3, __, __, __, L3, __], // 5
    [__, __, L2, __, __, __, L2, __, L2, __, __, __, L2, __, __], // 6
    [W3, __, __, L2, __, __, __, W2, __, __, __, L2, __, __, W3], // 7
    [__, __, L2, __, __, __, L2, __, L2, __, __, __, L2, __, __], // 8
    [__, L3, __, __, __, L3, __, __, __, L3, __, __, __, L3, __], // 9
    [__, __, __, __, W2, __, __, __, __, __, W2, __, __, __, __], // 10
    [L2, __, __, W2, __, __, __, L2, __, __, __, W2, __, __, L2], // 11
    [__, __, W2, __, __, __, L2, __, L2, __, __, __, W2, __, __], // 12
    [__, W2, __, __, __, L3, __, __, __, L3, __, __, __, W2, __], // 13
    [W3, __, __, L2, __, __, __, W3, __, __, __, L2, __, __, W3], // 14
  ];
})(BOARD_SQUARE_BONUSES);

// The standard bonus grid is symmetric, so the transpose aliases the original.
// If a future variant introduces an asymmetric layout, redefine this as the real
// transpose: the solver already branches on it at `isVertical ? INVERTED_BONUS_GRID
// : BONUS_GRID`, so an updated constant is picked up for free.
export const INVERTED_BONUS_GRID = BONUS_GRID;