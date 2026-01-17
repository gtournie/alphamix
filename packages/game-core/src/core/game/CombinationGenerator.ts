import { TILE_BLANK } from "./const";
import { AlphaCombinations, Combinations } from "./types";
import { escapeRegexp, sortAsciiString } from "./utils";

export class CombinationGenerator {
  /**
   * Generates combinations of characters from a string
   * @param str The input string
   * @param n The length of combinations to generate
   * @param index Optional starting index
   * @returns Array of combinations
   */
  static combinations(str: string, n: number, index?: number): string[] {
    if (str.length < n || --n < 0) return [];
    if (typeof index === 'undefined') index = 0;

    let result: string[] = [];
    for (let len = str.length; index !== len - n; ++index) {
      if (n <= 0) {
        result.push(str.charAt(index));
      } else {
        let value = str.charAt(index);
        let c = this.combinations(str, n, index); // let c = combinations(str, n, index + 1);
        for (let i = 0, l = c.length; i < l; ++i) {
          result.push(value + c[i]);
        }
      }
    }
    return result;
  }

  static readonly ALPHA_COMBINATIONS: AlphaCombinations = [
    [], // Don't need this one
    this.combinations('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1),
    this.combinations('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 2),
  ];
  static readonly REPLACE_BLANK_REG = new RegExp(escapeRegexp(TILE_BLANK), 'g');

  private readonly seenKeys = new Set<string>();
  private readonly wordsBySortedLetters: Map<string, string[]>;
  private readonly output: Combinations[];
  private readonly input: string;

  constructor(input: string, wordsBySortedLetters: Map<string, string[]>) {
    this.input = input;
    this.wordsBySortedLetters = wordsBySortedLetters;
    this.output = new Array(input.length + 1);
    for (let i = input.length; i >= 0; i--) {
      this.output[i] = { strict: [], incomplete: [] };
    }
  }

  generate(): Combinations[] {
    const len = this.input.length;
    const amount = 1 << len; // Math.pow(2, len)

    for (let i = 1; i < amount; i++) {
      let letters = '';
      const blanks: string[] = [];

      // Extract letters and blanks
      for (let j = 0; j < len; j++) {
        if ((1 << j) & i) {
          const c = this.input.charAt(j);
          if (c === TILE_BLANK) blanks.push(c);
          letters += c;
        }
      }

      if (blanks.length !== 0) {
        const comb = CombinationGenerator.ALPHA_COMBINATIONS[blanks.length];
        for (let k = comb.length - 1; k >= 0; k--) {
          const blankValues = comb[k];
          let index = 0;
          this.addUnique(letters.replace(CombinationGenerator.REPLACE_BLANK_REG, () => blankValues.charAt(index++)), blankValues);
        }
      } else {
        this.addUnique(letters, '');
      }
    }
    return this.output;
  }

  private addUnique(letters: string, blanks: string): void {
    const sortedLetters = sortAsciiString(letters);
    if (!this.seenKeys.has(sortedLetters)) {
      this.seenKeys.add(sortedLetters);

      this.output[letters.length].incomplete.push([sortedLetters, blanks]);
      if (this.wordsBySortedLetters.has(sortedLetters)) {
        this.output[letters.length].strict.push([sortedLetters, blanks]);
      }
    }
  }
}