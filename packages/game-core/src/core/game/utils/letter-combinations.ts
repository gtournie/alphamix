import { TILE_BLANK } from "../const";
import { AlphaCombinations, Combinations } from "../types";
import { escapeRegexp } from "./regex";
import { sortAsciiString } from "./string";

const ALPHA_COMBINATIONS: AlphaCombinations = [
  [], // Don't need this one
  combinations('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1),
  combinations('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 2),
];
const REPLACE_BLANK_REG = new RegExp(escapeRegexp(TILE_BLANK), 'g');

/**
 * Generates combinations of characters from a string
 * @param str The input string
 * @param n The length of combinations to generate
 * @param index Optional starting index
 * @returns Array of combinations
 */
function combinations(str: string, n: number, index?: number): string[] {
  if (str.length < n || --n < 0) return [];
  if (typeof index === 'undefined') index = 0;

  let result: string[] = [];
  for (let len = str.length; index !== len - n; ++index) {
    if (n <= 0) {
      result.push(str.charAt(index));
    } else {
      let value = str.charAt(index);
      let c = combinations(str, n, index); // let c = combinations(str, n, index + 1);
      for (let i = 0, l = c.length; i < l; ++i) {
        result.push(value + c[i]);
      }
    }
  }
  return result;
}

function addUnique(output: Combinations[], letters: string, blanks: string, seenKeys: Set<string>, wordsBySortedLetters: Map<string, string[]>): void {
  const sortedLetters = sortAsciiString(letters);
  if (!seenKeys.has(sortedLetters)) {
    seenKeys.add(sortedLetters);

    output[letters.length].incomplete.push([sortedLetters, blanks]);
    if (wordsBySortedLetters.has(sortedLetters)) {
      output[letters.length].strict.push([sortedLetters, blanks]);
    }
  }
}

export default function letterCombinations(input: string, wordsBySortedLetters: Map<string, string[]>) {
  const len = input.length;
  const amount = 1 << len; // Math.pow(2, len)
  const seenKeys = new Set<string>();

  //: Initialize output
  const output = new Array(input.length + 1);
  for (let i = input.length; i >= 0; i--) output[i] = { strict: [], incomplete: [] };

  for (let i = 1; i < amount; i++) {
    let letters = '';
    let countBlanks = 0;

    // Extract letters and blanks
    for (let j = 0; j < len; j++) {
      if ((1 << j) & i) {
        const c = input.charAt(j);
        if (c === TILE_BLANK) countBlanks++;
        letters += c;
      }
    }

    if (countBlanks !== 0) {
      const comb = ALPHA_COMBINATIONS[countBlanks];
      for (let k = comb.length - 1; k >= 0; k--) {
        const blankValues = comb[k];
        let index = 0;

        addUnique(
          output,
          letters.replace(REPLACE_BLANK_REG, () => blankValues.charAt(index++)),
          blankValues,
          seenKeys,
          wordsBySortedLetters
        );
      }
    } else {
      addUnique(output, letters, '', seenKeys, wordsBySortedLetters);
    }
  }
  return output;
}
