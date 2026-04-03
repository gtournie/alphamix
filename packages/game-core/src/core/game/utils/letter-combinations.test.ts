import { describe, it, expect } from 'vitest';
import letterCombinations from './letter-combinations';
import { TILE_BLANK } from '../const';

const normalize = (arr: [string, string][]) => arr.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));

describe('letter-combinations', () => {
  describe('generate', () => {
    it('should generate combinations for 1-character input', () => {
      const wordsMap = new Map<string, string[]>();
      wordsMap.set('A', ['A']);
      const result = letterCombinations('A', wordsMap);

      expect(result).toEqual([
        { strict: [], incomplete: [] },
        { strict: [['A', '']], incomplete: [['A', '']] }
      ]);
    });

    it('should generate combinations for 2-character input', () => {
      const wordsMap = new Map<string, string[]>();
      wordsMap.set('AB', ['AB']);
      wordsMap.set('A', ['A']);
      wordsMap.set('B', ['B']);
      const result = letterCombinations('AB', wordsMap);

      expect(result).toEqual([
        { strict: [], incomplete: [] },
        {
          strict: normalize([['A', ''], ['B', '']]),
          incomplete: normalize([['A', ''], ['B', '']])
        },
        {
          strict: [['AB', '']],
          incomplete: [['AB', '']]
        }
      ]);
    });

    it('should generate combinations for 3-character input', () => {
      const wordsMap = new Map<string, string[]>();
      wordsMap.set('ABC', ['ABC']);
      wordsMap.set('AB', ['AB']);
      wordsMap.set('AC', ['AC']);
      wordsMap.set('BC', ['BC']);
      wordsMap.set('A', ['A']);
      wordsMap.set('B', ['B']);
      wordsMap.set('C', ['C']);
      const result = letterCombinations('ABC', wordsMap);

      expect(result[0]).toEqual({ strict: [], incomplete: [] });
      expect(result[1]).toEqual({
        strict: normalize([['A', ''], ['B', ''], ['C', '']]),
        incomplete: normalize([['A', ''], ['B', ''], ['C', '']])
      });
      expect(result[2]).toEqual({
        strict: normalize([['AB', ''], ['AC', ''], ['BC', '']]),
        incomplete: normalize([['AB', ''], ['AC', ''], ['BC', '']])
      });
      expect(result[3]).toEqual({
        strict: [['ABC', '']],
        incomplete: [['ABC', '']]
      });
    });

    it('should handle input with blank tiles', () => {
      const wordsMap = new Map<string, string[]>();
      wordsMap.set('AA', ['AA']);
      wordsMap.set('AB', ['AB']);
      const result = letterCombinations('A' + TILE_BLANK, wordsMap);

      expect({
        strict: normalize(result[2].strict),
        incompleteLength: result[2].incomplete.length
      }).toEqual({
        strict: normalize([['AA', 'A'], ['AB', 'B']]),
        incompleteLength: 26
      });
    });

    it('should handle input with multiple blank tiles', () => {
      const wordsMap = new Map<string, string[]>();
      wordsMap.set('AB', ['AB']);
      const result = letterCombinations(TILE_BLANK + TILE_BLANK, wordsMap);

      expect({
        hasAB: result[2].strict.some(([letters]: [string]) => letters === 'AB'),
        incompleteLength: result[2].incomplete.length,
        incompleteLengthGreaterThanZero: result[2].incomplete.length > 0
      }).toEqual({
        hasAB: true,
        incompleteLength: expect.any(Number),
        incompleteLengthGreaterThanZero: true
      });
    });

    it('should separate strict and incomplete combinations', () => {
      const wordsMap = new Map<string, string[]>();
      wordsMap.set('AB', ['AB']); // Seulement 'AB' est un mot valide
      wordsMap.set('A', ['A']);   // 'A' est aussi valide
      const result = letterCombinations('ABC', wordsMap);

      expect(result).toEqual([
        { strict: [], incomplete: [] },
        {
          strict: [['A', '']],
          incomplete: normalize([['A', ''], ['B', ''], ['C', '']])
        },
        {
          strict: [['AB', '']],
          incomplete: normalize([['AB', ''], ['AC', ''], ['BC', '']])
        },
        {
          strict: [],
          incomplete: [['ABC', '']]
        }
      ]);
    });

    it('should generate all possible combinations for 7-character input', () => {
      const wordsMap = new Map<string, string[]>();
      const input = 'ABCDEFG';
      const result = letterCombinations(input, wordsMap);

      expect({
        length: result.length,
        hasCombinationsForAllLengths: Array.from({ length: 7 }, (_, i) => result[i + 1].incomplete.length > 0).every(Boolean)
      }).toEqual({
        length: 8,
        hasCombinationsForAllLengths: true
      });
    });

    it('should not duplicate combinations', () => {
      const wordsMap = new Map<string, string[]>();
      const result = letterCombinations('AAB', wordsMap);

      expect(result[2].incomplete).toEqual(normalize([['AA', ''], ['AB', '']]));
    });

    it('should handle input with only blank tiles (1-2 blanks supported)', () => {
      const wordsMap = new Map<string, string[]>();
      const result = letterCombinations(TILE_BLANK + TILE_BLANK, wordsMap);

      expect({
        result: [
          result[0],
          { strict: result[1].strict, incompleteLength: result[1].incomplete.length },
          { strict: result[2].strict, incompleteLength: result[2].incomplete.length, hasIncomplete: result[2].incomplete.length > 0 }
        ]
      }).toEqual({
        result: [
          { strict: [], incomplete: [] },
          { strict: [], incompleteLength: 26 },
          { strict: [], incompleteLength: expect.any(Number), hasIncomplete: true }
        ]
      });
    });

    it('should handle mixed input with letters and blanks', () => {
      const wordsMap = new Map<string, string[]>();
      wordsMap.set('AAB', ['AAB']);
      wordsMap.set('ABB', ['ABB']);
      const result = letterCombinations('A' + TILE_BLANK + 'B', wordsMap);

      expect({
        incompleteLength: result[3].incomplete.length,
        strict: normalize(result[3].strict)
      }).toEqual({
        incompleteLength: 26,
        strict: normalize([['AAB', 'A'], ['ABB', 'B']])
      });
    });
  });
});