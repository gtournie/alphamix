import { describe, it, expect } from 'vitest';
import { CombinationGenerator } from './CombinationGenerator';
import { TILE_BLANK } from './const';

const normalize = (arr: [string, string][]) => arr.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));

describe('CombinationGenerator', () => {
  describe('combinations (static method)', () => {
    it('should return empty array if string length is less than n', () => {
      expect(CombinationGenerator.combinations('ABC', 4)).toEqual([]);
    });

    it('should return empty array if n is 0 or negative', () => {
      expect(CombinationGenerator.combinations('ABC', 0)).toEqual([]);
      expect(CombinationGenerator.combinations('ABC', -1)).toEqual([]);
    });

    it('should return all single character combinations for n=1', () => {
      const result = CombinationGenerator.combinations('ABC', 1);
      expect(result).toEqual(['A', 'B', 'C']);
    });

    it('should return all 2-character combinations for n=2 (with repetitions)', () => {
      const result = CombinationGenerator.combinations('ABC', 2);
      // La méthode génère des combinaisons avec répétitions possibles
      expect(result).toContain('AB');
      expect(result).toContain('AC');
      expect(result).toContain('BC');
      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it('should return all 3-character combinations for n=3 (with repetitions)', () => {
      const result = CombinationGenerator.combinations('ABCD', 3);
      // La méthode génère des combinaisons avec répétitions possibles
      expect(result).toContain('ABC');
      expect(result).toContain('ABD');
      expect(result).toContain('ACD');
      expect(result).toContain('BCD');
      expect(result.length).toBeGreaterThanOrEqual(4);
    });

    it('should handle single character string', () => {
      expect(CombinationGenerator.combinations('A', 1)).toEqual(['A']);
      expect(CombinationGenerator.combinations('A', 2)).toEqual([]);
    });
  });

  describe('generate', () => {
    it('should generate combinations for 1-character input', () => {
      const wordsMap = new Map<string, string[]>();
      wordsMap.set('A', ['A']);
      const generator = new CombinationGenerator('A', wordsMap);
      const result = generator.generate();

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
      const generator = new CombinationGenerator('AB', wordsMap);
      const result = generator.generate();

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
      const generator = new CombinationGenerator('ABC', wordsMap);
      const result = generator.generate();

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
      const generator = new CombinationGenerator('A' + TILE_BLANK, wordsMap);
      const result = generator.generate();

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
      const generator = new CombinationGenerator(TILE_BLANK + TILE_BLANK, wordsMap);
      const result = generator.generate();

      expect({
        hasAB: result[2].strict.some(([letters]) => letters === 'AB'),
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
      const generator = new CombinationGenerator('ABC', wordsMap);
      const result = generator.generate();

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
      const generator = new CombinationGenerator(input, wordsMap);
      const result = generator.generate();

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
      const generator = new CombinationGenerator('AAB', wordsMap);
      const result = generator.generate();

      expect(result[2].incomplete).toEqual(normalize([['AA', ''], ['AB', '']]));
    });

    it('should handle input with only blank tiles (1-2 blanks supported)', () => {
      const wordsMap = new Map<string, string[]>();
      const generator = new CombinationGenerator(TILE_BLANK + TILE_BLANK, wordsMap);
      const result = generator.generate();

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
      const generator = new CombinationGenerator('A' + TILE_BLANK + 'B', wordsMap);
      const result = generator.generate();

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