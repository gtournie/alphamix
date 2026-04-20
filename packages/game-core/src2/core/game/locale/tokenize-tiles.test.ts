import { describe, expect, it } from 'vitest';
import { tokenizeTiles } from './tokenize-tiles';

const LATIN = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'N', 'T', 'Y', '·'];
const WITH_DIGRAPHS = [...LATIN, 'CH', 'LL', 'NY', 'L·L'];

describe('tokenizeTiles', () => {
  it('tokenizes a simple word with single-char tiles', () => {
    expect(tokenizeTiles('CAT', LATIN)).toEqual(['C', 'A', 'T']);
  });

  it('prefers the longest matching tile (greedy) — digraph at start', () => {
    expect(tokenizeTiles('CHAT', WITH_DIGRAPHS)).toEqual(['CH', 'A', 'T']);
  });

  it('matches digraph even when single-letter alternatives exist', () => {
    expect(tokenizeTiles('CHE', WITH_DIGRAPHS)).toEqual(['CH', 'E']);
  });

  it('tokenizes a digraph at the end of a word', () => {
    expect(tokenizeTiles('ALL', WITH_DIGRAPHS)).toEqual(['A', 'LL']);
  });

  it('tokenizes a digraph in the middle of a word', () => {
    expect(tokenizeTiles('ACHAT', WITH_DIGRAPHS)).toEqual(['A', 'CH', 'A', 'T']);
  });

  it('tokenizes the Catalan trigraph L·L (3 UTF-16 code units)', () => {
    expect(tokenizeTiles('L·LA', WITH_DIGRAPHS)).toEqual(['L·L', 'A']);
  });

  it('falls back to a plain "L" when trigraph would not match', () => {
    expect(tokenizeTiles('LA', WITH_DIGRAPHS)).toEqual(['L', 'A']);
  });

  it('throws with position when no tile matches', () => {
    expect(() => tokenizeTiles('CAZ', LATIN)).toThrow(/position 2/);
  });

  it('returns an empty array for an empty word', () => {
    expect(tokenizeTiles('', LATIN)).toEqual([]);
  });
});
