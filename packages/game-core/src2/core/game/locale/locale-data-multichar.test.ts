import { beforeAll, describe, expect, it } from 'vitest';
import LocaleData from './locale-data';
import { loadLocale } from '../__test-utils__/solver-fixtures';

describe('LocaleData — multi-character tiles', () => {
  let zxxdi: LocaleData;

  beforeAll(() => {
    zxxdi = loadLocale('zxx-di');
  });

  it('exposes CH / LL / L·L among upperAlphabet', () => {
    expect(zxxdi.upperAlphabet).toContain('CH');
    expect(zxxdi.upperAlphabet).toContain('LL');
    expect(zxxdi.upperAlphabet).toContain('L·L');
  });

  it('upperTiles excludes the separator', () => {
    expect(zxxdi.upperTiles).not.toContain('+');
    expect(zxxdi.upperTiles.length).toBe(zxxdi.upperAlphabet.length - 1);
  });

  it('assigns digraph tiles distinct charIds from their constituent letters', () => {
    const chId = zxxdi.charToId('CH');
    const cId = zxxdi.charToId('C');
    const hId = zxxdi.charToId('H');
    expect(chId).not.toBe(cId);
    expect(chId).not.toBe(hId);

    const llId = zxxdi.charToId('LL');
    const lId = zxxdi.charToId('L');
    expect(llId).not.toBe(lId);

    const trigraphId = zxxdi.charToId('L·L');
    expect(trigraphId).not.toBe(lId);
    expect(trigraphId).not.toBe(llId);
  });

  it('lowerAlphabet renders digraph tiles in lowercase', () => {
    const chId = zxxdi.charToId('CH');
    const llId = zxxdi.charToId('LL');
    const trigraphId = zxxdi.charToId('L·L');
    expect(zxxdi.lowerAlphabet[chId]).toBe('ch');
    expect(zxxdi.lowerAlphabet[llId]).toBe('ll');
    expect(zxxdi.lowerAlphabet[trigraphId]).toBe('l·l');
  });

  it('tokenize("CHAT") greedily picks CH over C+H', () => {
    const chId = zxxdi.charToId('CH');
    const aId = zxxdi.charToId('A');
    const tId = zxxdi.charToId('T');
    expect(zxxdi.tokenize('CHAT')).toEqual([chId, aId, tId]);
  });

  it('tokenize("L·LA") resolves the 3-code-unit trigraph as a single tile', () => {
    const trigraphId = zxxdi.charToId('L·L');
    const aId = zxxdi.charToId('A');
    expect(zxxdi.tokenize('L·LA')).toEqual([trigraphId, aId]);
  });

  it('tokenize("ALL") picks the LL digraph at the end of the word', () => {
    const aId = zxxdi.charToId('A');
    const llId = zxxdi.charToId('LL');
    expect(zxxdi.tokenize('ALL')).toEqual([aId, llId]);
  });

  it('tileScoresByCharId reflects digraph-specific scores', () => {
    const chId = zxxdi.charToId('CH');
    const trigraphId = zxxdi.charToId('L·L');
    // These match test-dict-digraph/build.ts — CH=5, L·L=10.
    expect(zxxdi.tileScoresByCharId[chId]).toBe(5);
    expect(zxxdi.tileScoresByCharId[trigraphId]).toBe(10);
  });
});
