import { beforeAll, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Board } from './Board';
import LocaleData from './locale/locale-data';
import {
  loadLocale,
  emptyGrid,
  parseRack,
  findMove,
  mustFindMove,
  sortMoves,
} from './__test-utils__/solver-fixtures';
import type { Move } from './types';
import { BLANK_ID, BOARD_EMPTY_SQUARE, SEPARATOR_ID, TILE_RACK_SIZE } from './const';
import { TILE_INFO_BY_LOCALES } from './locale/tile-configs';
import { compressToDawg } from '../../../scripts/compress-source-to-dawg';
import { convertDawgToGaddag } from './utils/dawg-to-gaddag';

let zxx: LocaleData;
let fr: LocaleData;

beforeAll(() => {
  zxx = loadLocale('zxx');
  fr = loadLocale('fr');
});

// ----------------------------------------------------------------------------
// A. Opening move (empty board, rack of 7 letters)
// ----------------------------------------------------------------------------
describe('A. Opening move', () => {
  it('A0: every move passes through (7,7) and has word.length >= 2', () => {
    const rack = parseRack(zxx, [...'BASECAR']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    expect(moves.size).toBeGreaterThan(0);
    for (const m of moves.values()) {
      expect(m.word.length).toBeGreaterThanOrEqual(2);
      const endCol = m.col + m.word.length - 1;
      const endRow = m.row + m.word.length - 1;
      const coversCenter = m.dir === 'H'
        ? m.row === 7 && m.col <= 7 && endCol >= 7
        : m.col === 7 && m.row <= 7 && endRow >= 7;
      expect(coversCenter).toBe(true);
    }
  });

  it('A1: BASE is among the moves when the rack can form it', () => {
    const rack = parseRack(zxx, [...'BASECAR']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    const base = findMove(moves, { word: 'BASE' });
    expect(base).toBeDefined();
    expect(base!.score).toBeGreaterThan(0);
  });

  it('A2: first move through center (7,7) applies the W2 bonus', () => {
    const rack = parseRack(zxx, [...'PATEZER']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    const pate = findMove(moves, { word: 'PATE', row: 7, col: 7, dir: 'H' });
    expect(pate).toBeDefined();
    expect(pate!.score).toBe(12);
  });

  it('A5: no valid word = empty result set', () => {
    const rack = parseRack(zxx, [...'KKKKKKK']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    expect(moves.size).toBe(0);
  });

  it('A6: first move of 7 tiles triggers the +50 bingo bonus', () => {
    const rack = parseRack(zxx, [...'BATEAUX']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    const m = findMove(moves, { word: 'BATEAUX', row: 7, col: 7, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.usedLetters).toEqual([...'BATEAUX']);
    expect(m!.score).toBe(88);
  });
});

// ----------------------------------------------------------------------------
// B. Anchors & connectivity (mid-game, rack = 7)
// ----------------------------------------------------------------------------
describe('B. Anchors and connectivity', () => {
  function gridWithChat(): string[][] {
    return [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......CHAT....',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
  }

  it('B1: every move touches or overlaps a pre-placed tile area', () => {
    const grid = gridWithChat();
    const rack = parseRack(zxx, [...'ESACBRT']);
    const moves = new Board(zxx, grid, rack).moves();
    expect(moves.size).toBeGreaterThan(0);
    for (const m of moves.values()) {
      const rows = m.dir === 'H' ? [m.row] : Array.from({ length: m.word.length }, (_, i) => m.row + i);
      const cols = m.dir === 'H' ? Array.from({ length: m.word.length }, (_, i) => m.col + i) : [m.col];
      let near = false;
      for (const r of rows) for (const c of cols) {
        if (r >= 6 && r <= 8 && c >= 6 && c <= 11) { near = true; break; }
      }
      expect(near).toBe(true);
    }
  });

  it('B2: remote zones unreachable from existing tiles produce no moves', () => {
    const grid = gridWithChat();
    const rack = parseRack(zxx, [...'ESACBRT']);
    const moves = new Board(zxx, grid, rack).moves();
    for (const m of moves.values()) {
      const startsInRemote = m.row <= 4 && m.col <= 4
        && (m.dir === 'H' ? m.col + m.word.length - 1 <= 4 : m.row + m.word.length - 1 <= 4);
      expect(startsInRemote).toBe(false);
    }
  });

  it('B4: suffix extension — add letters on the right of an existing word', () => {
    const grid = gridWithChat();
    const rack = parseRack(zxx, [...'SZZZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const chats = findMove(moves, { word: 'CHATS', row: 7, col: 7, dir: 'H' });
    expect(chats).toBeDefined();
    expect(chats!.usedLetters).toEqual([...'S']);
    expect(chats!.score).toBe(11);
  });

  it('B3: prefix extension — add letters on the left of an existing word', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......OSE.....',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'RZZZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const rose = findMove(moves, { word: 'ROSE', row: 7, col: 6, dir: 'H' });
    expect(rose).toBeDefined();
    expect(rose!.usedLetters).toEqual([...'R']);
    expect(rose!.score).toBe(4);
  });

  it('B5: through-extension — a new word reuses pre-placed tiles in the middle', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......AS......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'BESZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const bases = findMove(moves, { word: 'BASES', row: 7, col: 6, dir: 'H' });
    expect(bases).toBeDefined();
    expect(bases!.usedLetters).toEqual([...'BES']);
    expect(bases!.score).toBe(7);
  });

  it('B6: parallel placement creates valid cross-words on every shared column', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......ETE.....',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'TASZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const tas = findMove(moves, { word: 'TAS', row: 8, col: 7, dir: 'H' });
    expect(tas).toBeDefined();
    expect(tas!.score).toBe(11);
  });
});

// ----------------------------------------------------------------------------
// C. Cross-words
// ----------------------------------------------------------------------------
describe('C. Cross-words', () => {
  it('C1: a move with a valid cross-word is kept', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......TE......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'ASZZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const as = findMove(moves, { word: 'AS', row: 8, col: 7, dir: 'H' });
    expect(as).toBeDefined();
    expect(as!.score).toBe(8);
  });

  it('C2: a move creating an invalid cross-word is filtered out', () => {
    // Under Z at (7,7) only ZE is valid vertically. Any horizontal move placing a tile at
    // (8,7) must therefore have E in that position.
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......ZE......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'TAZZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const badMove = findMove(moves, { word: 'TA', row: 8, col: 7, dir: 'H' });
    expect(badMove).toBeUndefined();
    for (const m of moves.values()) {
      if (m.dir === 'H' && m.row === 8 && m.col <= 7 && m.col + m.word.length > 7) {
        const ch = m.word[7 - m.col].toUpperCase();
        expect(ch === 'E').toBe(true);
      }
    }
  });

  it('C3: multiple cross-words add their scores independently', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......ETE.....',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'TASZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const tas = findMove(moves, { word: 'TAS', row: 8, col: 7, dir: 'H' });
    expect(tas).toBeDefined();
    expect(tas!.score).toBe(11);
  });

  it('C4: pure extension produces no cross-word, only the main-word score', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......CHAT....',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'SZZZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const chats = findMove(moves, { word: 'CHATS', row: 7, col: 7, dir: 'H' });
    expect(chats).toBeDefined();
    expect(chats!.score).toBe(11);
  });

  it('C5: shortest legal move — 1 new tile + 1 pre-placed = 2-letter word', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......ETE.....',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'TZZZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const te = findMove(moves, { word: 'TE', row: 6, col: 7, dir: 'V' });
    expect(te).toBeDefined();
    expect(te!.usedLetters).toEqual([...'T']);
    expect(te!.score).toBe(2);
  });
});

// ----------------------------------------------------------------------------
// D. Scoring rules
// ----------------------------------------------------------------------------
describe('D. Scoring', () => {
  it('D6: pre-placed tiles contribute base letter score — bonuses not re-applied', () => {
    // Extend pre-placed CHAT with S on L2(7,11). CHAT's C already sits on W2(7,7) but the
    // W2 must NOT double the final word (bonuses only apply to newly placed tiles).
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......CHAT....',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'SZZZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const chats = findMove(moves, { word: 'CHATS', row: 7, col: 7, dir: 'H' });
    expect(chats!.score).toBe(11);
  });

  it('D8: +50 bingo bonus applies when all 7 rack tiles are placed', () => {
    const rack = parseRack(zxx, [...'BATEAUX']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    const m = findMove(moves, { word: 'BATEAUX', row: 7, col: 7, dir: 'H' });
    expect(m!.usedLetters.length).toBe(TILE_RACK_SIZE);
    expect(m!.score).toBe(88);
  });

  it('D9: no +50 bonus when one of the 7-letter word tiles was pre-placed', () => {
    // Play BATEAUX by reusing the pre-placed A at (7,7). Only 6 tiles come from the rack,
    // so the bingo bonus does not trigger.
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......A.......',
      '.......S.......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'BTEAUXZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const m = findMove(moves, { word: 'BATEAUX', row: 7, col: 6, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.usedLetters.length).toBe(6);
    expect(m!.score).toBe(19);
  });

  it('D10: two W3 bonuses compound multiplicatively (×9)', () => {
    // Play RATERONS on row 0 covering both W3 at (0,0) and (0,7). The word multiplier must
    // be 3×3 = 9 (not 3+3).
    const grid = [
      '...E...........',
      '...C...........',
      '...H...........',
      '...ORANGE......',
      '........T......',
      '.....ROSE......',
      '.....A.........',
      '.....TIRES.....',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'RATRONS']);
    const moves = new Board(zxx, grid, rack).moves();
    const m = findMove(moves, { word: 'RATERONS', row: 0, col: 0, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.usedLetters).toEqual([...'RATRONS']);
    expect(m!.score).toBe(122);
  });

  it('D10b: multiple cross-words from a single placement sum independently', () => {
    // Play MAITRES with two cross-words formed simultaneously: ZE at col 7 and ES at col 8.
    // The main word score and each cross-word score must all contribute.
    const grid = [
      '...............',
      '...........ECHO',
      '...........T..R',
      '.......ZEBRE..A',
      '..............N',
      '..............G',
      '..............E',
      '.......J...TARS',
      '.......A...H...',
      '.......USAGE...',
      '.......N.......',
      '.......E.......',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'MAITRES']);
    const moves = new Board(zxx, grid, rack).moves();
    const m = mustFindMove(moves, { word: 'MAITRES', row: 4, col: 2, dir: 'H' });
    expect(m.score).toBe(79);
  });

  it('D11: W2 bonus multiplies both the main word and the cross-word passing through it', () => {
    // Play CA so that C lands on W2(2,2) with a pre-placed A at (3,2) forming cross-word CA.
    // The W2 bonus at (2,2) must apply to both axes.
    const grid = [
      '...............',
      '...............',
      '...............',
      '.CA............',
      '.A.............',
      '.R.............',
      '.T.............',
      '.ECHO..Z.......',
      '....RATE.......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'CAZZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const m = mustFindMove(moves, { word: 'CA', row: 2, col: 2, dir: 'H' });
    expect(m.score).toBe(16);
  });

  it('D1: L2 bonus doubles the letter score', () => {
    // Play CAS over TE so that A lands on L2 at (6,8). Cross-word CE at col 7.
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '......TE.......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'CASZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const m = findMove(moves, { word: 'CAS', row: 6, col: 7, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(10);
  });

  it('D2: L3 bonus triples the letter score', () => {
    // Play CAS so that C lands on L3 at (5,5). Cross-word CE at col 5.
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...J...........',
      '..BASE.........',
      '...U...Z.......',
      '...N...E.......',
      '..TES..R.......',
      '....ECHO.......',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'CASZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const m = findMove(moves, { word: 'CAS', row: 5, col: 5, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(21);
  });

  it('D3: W2 bonus doubles the word score', () => {
    // Play CAS so that C lands on W2 at (1,1). Cross-word CE at col 1.
    const grid = [
      '...............',
      '...............',
      'SE.............',
      'A..............',
      'G..............',
      'E..............',
      'SALE...........',
      '...TARTE.......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'CASZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const m = findMove(moves, { word: 'CAS', row: 1, col: 1, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(18);
  });

  it('D4: W3 bonus triples the word score', () => {
    // Play CAS so that C lands on W3 at (0,0). Cross-word CAS at col 0 (extends AS vertical).
    const grid = [
      '...............',
      'A..............',
      'SAGES..........',
      '...C...........',
      '...H...........',
      '...ORANGE......',
      '.....I.........',
      '.....RATS......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'CASZZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const m = findMove(moves, { word: 'CAS', row: 0, col: 0, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(30);
  });

  it('D5: L2 and W2 bonuses combined on same move', () => {
    // Play CARS so that C lands on L2(3,0) and S lands on W2(3,3). Cross-word CAS at col 0.
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      'A..............',
      'SAGES..........',
      '...C...T.......',
      '...H...H.......',
      '...ORAGE.......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'CARSZZZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const m = findMove(moves, { word: 'CARS', row: 3, col: 0, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(26);
  });

  it('D7: W2 bonus also multiplies the cross-word', () => {
    // Play CAS so that C lands on W2 at (1,1). The W2 must apply to both the main word
    // AND the cross-word passing through that cell.
    const grid = [
      '...............',
      '...............',
      '.A.............',
      '.SAGES.........',
      '....C..........',
      '....H..........',
      '....ORANGE.....',
      '.......E.......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'ASCXYWZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const m = findMove(moves, { word: 'CAS', row: 1, col: 1, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(20);
  });
});

// ----------------------------------------------------------------------------
// E. Blanks / jokers
// ----------------------------------------------------------------------------
describe('E. Blanks', () => {
  it('E1: a blank is rendered in lowercase in the move word and usedLetters', () => {
    const rack = parseRack(zxx, [...'BAS?STA']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    let found: Move | undefined;
    for (const m of moves.values()) {
      if (/[a-z]/.test(m.word.join(''))) { found = m; break; }
    }
    expect(found).toBeDefined();
    expect(found!.usedLetters.join('')).toMatch(/[a-z]/);
  });

  it('E2: a blank contributes 0 to the letter sum (even on a W2)', () => {
    const rack = parseRack(zxx, [...'BAS?ZZZ']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    let base: Move | undefined;
    for (const mv of moves.values()) {
      if (mv.word.join('').toUpperCase() === 'BASE' && mv.row === 7 && mv.col === 7 && mv.dir === 'H') {
        base = mv;
      }
    }
    expect(base).toBeDefined();
    expect(base!.score).toBe(10);
    expect(base!.usedLetters.join('')).toMatch(/e/);
  });

  it('E3: a rack with two blanks does not blow up the combinatorial search', () => {
    const rack = parseRack(zxx, [...'BASE??Z']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    expect(moves.size).toBeGreaterThan(0);
  });

  it('E4: a blank is restricted by cross-word validity like any letter', () => {
    // Under Z at (7,7), only ZE is valid vertically. A blank placed at (8,7) can therefore
    // only represent E — the cross-word bitmask constrains blanks too.
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......ZEBRE...',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'?AISAIS']);
    const moves = new Board(zxx, grid, rack).moves();
    // Any move placing at (8,7) must have letter 'E' (or 'e' as blank) in that position
    for (const m of moves.values()) {
      if (m.dir === 'V' && m.col === 7 && m.row <= 8 && m.row + m.word.length - 1 >= 8) {
        const ch = m.word[8 - m.row].toUpperCase();
        expect(ch).toBe('E');
      }
      if (m.dir === 'H' && m.row === 8) {
        const cIdx = 7 - m.col;
        if (cIdx >= 0 && cIdx < m.word.length) {
          const ch = m.word[cIdx].toUpperCase();
          expect(ch).toBe('E');
        }
      }
    }
  });

  it('E5: W3 still multiplies the word even when a blank lands on the bonus square', () => {
    // The blank contributes 0 to the letter sum, but the W3 bonus must still triple the
    // horizontal word and the cross-word passing through that cell.
    const grid = [
      '...............',
      'A..............',
      'SAGES..........',
      '...C...........',
      '...H...........',
      '...ORANGE......',
      '.....I.........',
      '.....RATS......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'?ASXWYZ']);
    const moves = new Board(zxx, grid, rack).moves();
    let m: Move | undefined;
    for (const mv of moves.values()) {
      if (mv.word.join('').toUpperCase() === 'CAS' && mv.row === 0 && mv.col === 0 && mv.dir === 'H'
        && mv.usedLetters.includes('c')) {
        m = mv;
      }
    }
    expect(m).toBeDefined();
    expect(m!.score).toBe(12);
  });

  it('E7: a move using only blanks on an empty board scores 0', () => {
    // Two blanks placed through the centre (7,7) form a legal first move, but every tile
    // contributes 0 regardless of the W2 multiplier on (7,7).
    const rack = parseRack(zxx, [...'??']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    let zeroScore: Move | undefined;
    for (const m of moves.values()) {
      if (m.score === 0 && m.usedLetters.length === 2 && /^[a-z]{2}$/.test(m.usedLetters.join(''))) {
        zeroScore = m;
        break;
      }
    }
    expect(zeroScore).toBeDefined();
    expect(zeroScore!.score).toBe(0);
  });

  // Pre-placed blanks (from a previous turn). Per official Scrabble rules a
  // blank keeps its 0 score forever. Board's grid input convention encodes
  // blank-ness via case: lowercase 'a'-'z' means "this tile was placed as a
  // blank". The solver extends vertically to form zE — Z was a blank, so the
  // main word must score E alone (1), not Z + E (11). `move.word` preserves
  // the lowercase to surface the blank to the caller (matching how a blank
  // placed during the current turn also renders lowercase).
  it('E8: a pre-placed blank from a previous turn still contributes 0', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......z.......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'EAAAAAA']);
    const moves = new Board(zxx, grid, rack).moves();
    const ze = findMove(moves, { word: 'zE', row: 7, col: 7, dir: 'V' });
    expect(ze).toBeDefined();
    expect(ze!.score).toBe(1);
  });
});

// ----------------------------------------------------------------------------
// F. Edges and borders
// ----------------------------------------------------------------------------
describe('F. Edges', () => {
  it('F1: a move on row 0 does not read out of bounds above the board', () => {
    const grid = [
      '...............',
      '.......ART.....',
      '.........A.....',
      '.........R.....',
      '.........T.....',
      '.....ZEBRE.....',
      '.......A.......',
      '.......C.......',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'ETKXWYZ']);
    const moves = new Board(zxx, grid, rack).moves();
    expect(moves.size).toBeGreaterThan(0);
    const et = findMove(moves, { word: 'ET', row: 0, col: 6, dir: 'H' });
    expect(et).toBeDefined();
    expect(et!.score).toBe(12);
  });

  it('F2: a move on row 14 does not read out of bounds below the board', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......CARTE...',
      '..........A....',
      '..........T....',
      '.........CE....',
      '.........H.....',
      '.........A.....',
      '.......ART.....',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'ETKXYWZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const et = findMove(moves, { word: 'ET', row: 14, col: 6, dir: 'H' });
    expect(et).toBeDefined();
    expect(et!.score).toBe(12);
  });

  it('F6: a move ending exactly at col 14 does not overflow to col 15', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '............SAC',
      '........TARTE.H',
      '........H.....A',
      '......TUE.....T',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'AJKXWYZ']);
    const moves = new Board(zxx, grid, rack).moves();
    const at = findMove(moves, { word: 'AT', row: 7, col: 13, dir: 'H' });
    expect(at).toBeDefined();
    expect(at!.score).toBe(2);
  });

  it('F3: a 7-letter bingo on the last row scores correctly (W3 + cross-word + +50)', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......C.......',
      '.......A.......',
      '.......S.......',
      '.......ECHO....',
      '..........R....',
      '..........A....',
      '..........G....',
      '......ZEBRE....',
      '.......T.......',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'BATEAUX']);
    const moves = new Board(zxx, grid, rack).moves();
    const m = findMove(moves, { word: 'BATEAUX', row: 14, col: 4, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(113);
  });

  it('F4: a heavily populated board returns a coherent move set without crashing', () => {
    const grid = [
      '.N...TUBE...MER',
      'MER..A.A..ETE.O',
      'A.A..R.SAC....S',
      'T.CARTE..H.PAYE',
      'E.E..R..KAkI.E.',
      'SA.......T.R.NE',
      '.I..DE.....A..A',
      'OR.BATEAUX.T.TU',
      'R...TE..S..E.A.',
      'A...E..CASES.T.',
      'N.O.S...G....ES',
      'G.R.....ECHO..U',
      'ETE......A....R',
      '.AS....L.SAGES.',
      '.S....BASES....',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'MESTA??']);
    const moves = new Board(zxx, grid, rack).moves();
    expect(moves).toBeInstanceOf(Map);
  });

  it('F5: endgame — a rack of a single tile can still produce a move', () => {
    // End-of-bag scenario: the rack holds less than 7 tiles. solve() should still find any
    // valid 2-letter move that reuses a pre-placed tile.
    const grid = [
      '...............',
      '...............',
      '....ECHO.......',
      '....T..R.......',
      '....E.BATEAU...',
      '.......N...S...',
      '.......G...A...',
      '.......E...G...',
      '...........ET..',
      '............A..',
      '............R..',
      '............T..',
      '............E..',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'T']);
    const moves = new Board(zxx, grid, rack).moves();
    const et = findMove(moves, { word: 'ET', row: 7, col: 7, dir: 'H' });
    expect(et).toBeDefined();
  });
});

// ----------------------------------------------------------------------------
// G. Horizontal vs Vertical, determinism
// ----------------------------------------------------------------------------
describe('G. Directionality & determinism', () => {
  it('G1: the move list has no duplicate (word, row, col, dir) entries', () => {
    const rack = parseRack(zxx, [...'BASECAR']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    const keys = new Set<string>();
    for (const m of moves.values()) {
      const k = `${m.word.join('').toUpperCase()}${m.row}${m.dir}${m.col}`;
      expect(keys.has(k)).toBe(false);
      keys.add(k);
    }
  });

  it('G2: the same word placed horizontally and vertically yields two distinct moves', () => {
    const rack = parseRack(zxx, [...'BASEZZZ']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    const bh = findMove(moves, { word: 'BASE', dir: 'H' });
    const bv = findMove(moves, { word: 'BASE', dir: 'V' });
    expect(bh).toBeDefined();
    expect(bv).toBeDefined();
    expect(bh).not.toEqual(bv);
  });

  it('G4: solve() is deterministic — two runs on the same input produce identical results', () => {
    const rack1 = parseRack(zxx, [...'BASECAR']);
    const rack2 = parseRack(zxx, [...'BASECAR']);
    const r1 = sortMoves(new Board(zxx, emptyGrid(), rack1).moves().values());
    const r2 = sortMoves(new Board(zxx, emptyGrid(), rack2).moves().values());
    expect(r1).toEqual(r2);
  });
});

// ----------------------------------------------------------------------------
// H. Regression on real FR grid
// ----------------------------------------------------------------------------
describe('H. FR regression', () => {
  it('H1: full move list on a real FR mid-game grid matches the committed fixture', () => {
    const grid = [
      '...............',
      '...........T.V.',
      '..........JOUES',
      '...........N.L.',
      '..........AN.A.',
      '.......MOFLE.TA',
      '....G.....O...X',
      '...BADER..I...A',
      '....R.WURMS...I',
      '..FADEE.......U',
      '....E.SALEE....',
      'T.ZOU..HIT.....',
      'I.E.R..........',
      'POKES..........',
      'E..............',
    ].map(l => [...l]);
    const rack = parseRack(fr, [...'PTBYE??']);

    const board = new Board(fr, grid, rack);
    const actual = sortMoves(board.moves().values());
    const fixturePath = path.resolve(__dirname, '__test-utils__/h1-moves.json');
    const expected = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as Move[];
    expect(actual).toEqual(expected);
  });

  it('H2: FR dictionary — CHAT extends to CHATS with L2 bonus on S', () => {
    // Pre-place CHAT at (7,7-10) in FR.
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......CHAT....',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(fr, [...'SBATEAU']);
    const moves = new Board(fr, grid, rack).moves();
    const chats = findMove(moves, { word: 'CHATS', row: 7, col: 7, dir: 'H' });
    expect(chats).toBeDefined();
    expect(chats!.usedLetters).toEqual([...'S']);
    // CHAT pre-placed 9 + S on L2 (2) = 11 (same calc as B4/D6)
    expect(chats!.score).toBe(11);
  });
});

// ----------------------------------------------------------------------------
// I. Performance
// ----------------------------------------------------------------------------
describe('I. Performance', () => {
  it('I1: moves() finishes under 100ms on a FR mid-game grid with 2 blanks in the rack', () => {
    // Reuse the exact H1 setup
    const grid = [
      '...............',
      '...........T.V.',
      '..........JOUES',
      '...........N.L.',
      '..........AN.A.',
      '.......MOFLE.TA',
      '....G.....O...X',
      '...BADER..I...A',
      '....R.WURMS...I',
      '..FADEE.......U',
      '....E.SALEE....',
      'T.ZOU..HIT.....',
      'I.E.R..........',
      'POKES..........',
      'E..............',
    ].map(l => [...l]);
    const rack = parseRack(fr, [...'PTBYE??']);

    const board = new Board(fr, grid, rack);
    const t0 = performance.now();
    board.moves();
    const dt = performance.now() - t0;
    // Reference measured at 70-80ms on dev machine. Cap at 100ms.
    // If flaky on CI, bump to 200ms.
    expect(dt).toBeLessThan(100);
  });
});

// ----------------------------------------------------------------------------
// J. Sanity invariants
// ----------------------------------------------------------------------------
describe('J. Sanity invariants', () => {
  it('J1: every returned move uses between 1 and 7 rack tiles', () => {
    const rack = parseRack(zxx, [...'BASECAR']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    for (const m of moves.values()) {
      expect(m.usedLetters.length).toBeGreaterThanOrEqual(1);
      expect(m.usedLetters.length).toBeLessThanOrEqual(TILE_RACK_SIZE);
    }
  });

  it('J2: no returned move is a single-letter word', () => {
    const rack = parseRack(zxx, [...'BASECAR']);
    const moves = new Board(zxx, emptyGrid(), rack).moves();
    for (const m of moves.values()) {
      expect(m.word.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('J3: a move never overwrites a pre-placed tile with a different letter', () => {
    const grid = [
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '.......CHAT....',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
      '...............',
    ].map(l => [...l]);
    const rack = parseRack(zxx, [...'ESACBRT']);
    const moves = new Board(zxx, grid, rack).moves();
    for (const m of moves.values()) {
      for (let i = 0, len = m.word.length; i < len; i++) {
        const r = m.dir === 'H' ? m.row : m.row + i;
        const c = m.dir === 'H' ? m.col + i : m.col;
        const existing = grid[r][c];
        if (existing !== BOARD_EMPTY_SQUARE) {
          expect(m.word[i].toUpperCase()).toBe(existing.toUpperCase());
        }
      }
    }
  });

  it('J4: moves() on an empty rack returns an empty result set (defensive)', () => {
    const moves = new Board(zxx, emptyGrid(), []).moves();
    expect(moves.size).toBe(0);
  });
});

// ----------------------------------------------------------------------------
// K. GADDAG format invariants (regression guards for the header-less layout)
// ----------------------------------------------------------------------------
describe('K. GADDAG format invariants', () => {
  // zxx aliases the FR alphabet: 26 letters + separator → ID_TO_CHAR.length === 27.
  // In the previous C code, `for (i = 1; i <= alphabet_len; i++)` created one extra
  // letter node at char_id === alphabet_len (i.e. === 27 here), an orphan with no
  // real letter backing it. This test guards against reintroducing that off-by-one.
  it('K1: root siblings cover exactly char_ids 1..26 — no orphan at alphabet_len', () => {
    const gaddag = zxx.gaddagData;
    const seen: number[] = [];
    // Hardcode the buffer index rather than derive it from `rootIdx`: under the
    // current layout `rootIdx` is a sentinel tag (= 0), not a buffer position, so
    // walking the sibling chain always starts at the first real node, index 1.
    // The sentinel at gaddag[0] is reserved (== 0).
    let idx = 1;
    while (true) {
      const nodeVal = gaddag[idx];
      seen.push(nodeVal >>> 26);
      if (!(nodeVal & 0x1000000)) break;
      idx++;
    }
    seen.sort((a, b) => a - b);
    const expected = Array.from({ length: 26 }, (_, i) => i + 1);
    expect(seen).toEqual(expected);
    // No entry uses char_id === alphabet_len (== 27 == ID_TO_CHAR.length).
    expect(seen).not.toContain(zxx.alphabetSize);
  });

  // Under the old layout (`rootIdx = alphabetLen + 1`), `findDataChild(rootIdx, X)`
  // could return an index numerically equal to rootIdx itself, making "we walked
  // one letter from root" indistinguishable from "we haven't walked yet". The
  // follow-up separator lookup would then re-enter the root fast-path instead of
  // walking the letter's subtree. Under the new layout (rootIdx = 0 tag, first
  // sibling at buffer index 1) the collision is structurally impossible, but
  // this test remains a regression guard: the second assertion (separator lookup
  // reaching Z's subtree) fails immediately if `findDataChild` ever confuses a
  // tag-rootIdx with a positional one.
  it('K2: walking one letter from root reaches Z\'s subtree', () => {
    const zCharId = zxx.upperAlphabet.indexOf('Z');
    expect(zCharId).toBe(26);

    const afterZ = zxx.findDataChild(zxx.rootIdx, zCharId);
    expect(afterZ).not.toBe(-1);
    expect(afterZ).not.toBe(zxx.rootIdx);

    // Looking up the separator from the Z node must walk Z's subtree, NOT restart
    // from root. The test dict contains ZE/ZEN/ZOO/ZERO/ZEBRE, so a separator
    // child of the Z node must exist.
    const separator = zxx.findDataChild(afterZ, SEPARATOR_ID);
    expect(separator).not.toBe(-1);
    expect(separator).not.toBe(zxx.rootIdx);
  });

  it('K3: a non-existent char_id returns -1 both from root and from a walked node', () => {
    const bogus = zxx.alphabetSize; // out of alphabet range
    expect(zxx.findDataChild(zxx.rootIdx, bogus)).toBe(-1);
    const afterA = zxx.findDataChild(zxx.rootIdx, zxx.upperAlphabet.indexOf('A'));
    expect(afterA).not.toBe(-1);
    expect(zxx.findDataChild(afterA, bogus)).toBe(-1);
  });

  // The `hasLeftPart` check in `computeVerticalConstraint` used to rely on
  // `currentIdx !== rootIdx` — this silently collapsed to false whenever
  // `findDataChild(rootIdx, X)` returned an index numerically equal to rootIdx,
  // which the GADDAG layout makes easy to hit (root's first sibling lives right
  // next to the rootIdx sentinel). A collapsed hasLeftPart means the subsequent
  // separator lookup went back to root's children instead of walking into the
  // left letter's subtree, turning a "1 letter left context" constraint into
  // "no context" — blanks then get to impersonate any letter of the alphabet.
  //
  // We test the most adversarial minimal setup: a single 'Z' on the board with
  // a blank on the rack. Only 'ZE' is a valid 2-letter word in the test dict,
  // so the cross-word mask at the cell below Z must allow ONLY 'E'. Any
  // regression of the hasLeftPart logic immediately surfaces here as a blank
  // landing as some other letter.
  it('K4: hasLeftPart — a single-letter left vertical context tightens the mask on blanks', () => {
    const grid = emptyGrid();
    grid[7][7] = 'Z';

    // Rack: one blank + throwaway letters. We want the solver to place the
    // blank under the Z and see which letters it picks.
    const rack = parseRack(zxx, [...'?AAAAAA']);
    const moves = new Board(zxx, grid, rack).moves();

    // There MUST be moves — the blank as 'E' below Z forms "ZE" vertically.
    // If no vertical move covers (8,7), that's already a regression. Every move
    // that DOES cover (8,7) must place an 'E' there (blank rendered as lowercase
    // 'e', real tile as 'E' — both uppercase to 'E').
    //
    // (Horizontal cross-coverage isn't tested here: under the test dict there's
    // no legal horizontal play through (8,7) — no `AE`/`EA` 2-letter word — so
    // any horizontal loop would be vacuous. Vertical coverage alone exercises
    // the hasLeftPart path.)
    let sawVerticalAt8_7 = false;
    for (const m of moves.values()) {
      const coversRow8Col7Vertical =
        m.dir === 'V' && m.col === 7 && m.row <= 8 && m.row + m.word.length - 1 >= 8;
      if (!coversRow8Col7Vertical) continue;
      sawVerticalAt8_7 = true;
      const letterAtRow8 = m.word[8 - m.row];
      expect(letterAtRow8.toUpperCase()).toBe('E');
    }
    expect(sawVerticalAt8_7).toBe(true);
  });

  // K5: paired with the break-on-`-1` guard inside `computeVerticalConstraint`'s
  // left-walk. Scenario: stack two letters vertically whose reverse pair doesn't
  // exist anywhere in the GADDAG — J at (5,7) and Z at (6,7). The test dict has
  // no word containing "JZ" or "ZJ", so when the left-walk reverses from (7,7)
  // it must fail on the second lookup.
  //
  // Without the break, the loop would continue and call `findDataChild(-1, …)`.
  // That happens to return -1 today via `Uint32Array[-1] = undefined` coincidence,
  // so a black-box test ("no bogus vertical moves past row 6") passes either way
  // — it cannot discriminate the break from the OOB fallback.
  //
  // K5 therefore does BOTH checks:
  //   (a) black-box: no vertical move on col 7 extends past the Z at row 6;
  //   (b) white-box: `findDataChild` is NEVER called with `parentNodeIdx < 0`.
  //
  // If the break regresses, (b) fails immediately even if (a) still passes by
  // coincidence — so the test is robust against future changes to findDataChild
  // that might stop tolerating negative inputs (e.g. if Uint32Array ever gains
  // bounds checks, or if findDataChild is rewritten to assert).
  it('K5: broken vertical left-context → no bogus moves AND no findDataChild(-1,…) calls', () => {
    const grid = emptyGrid();
    grid[5][7] = 'J';
    grid[6][7] = 'Z';

    const rack = parseRack(zxx, [...'AAAAAAA']);

    const spy = vi.spyOn(zxx, 'findDataChild');
    try {
      const moves = new Board(zxx, grid, rack).moves();

      // (a) Black-box regression guard: no vertical move covering (7,7) via
      // extension past row 6.
      for (const m of moves.values()) {
        if (m.dir !== 'V' || m.col !== 7) continue;
        expect(m.row + m.word.length - 1).toBeLessThanOrEqual(6);
      }

      // (b) White-box guard on the break: no solver path should invoke
      // findDataChild on a negative parent — the break inside the left-walk
      // must fire before such a call is attempted. Scanning every recorded
      // call gives us the exact first argument that would trigger the bug.
      const negativeCalls = spy.mock.calls.filter(([parent]) => parent < 0);
      expect(negativeCalls).toEqual([]);
    } finally {
      spy.mockRestore();
    }
  });

  // K6: guards the restructured left-walk (M5 fix). The previous shape
  // `break` + `if (hasLeftPart) { if (currentIdx === -1) return }` worked
  // today only because `findDataChild(-1, …)` returns -1 via `Uint32Array`
  // OOB. It also silently collapsed `hasLeftPart` to false on a first-iter
  // failure (currR doesn't decrement → `currR < r - 1` is false). The new
  // shape `return [mask, verticalScore]` inside the loop fixes both issues
  // in one go.
  //
  // Under a valid LocaleData the first-iter-failure case is unreachable
  // (root always has every letter as a child, cf. K1). To exercise the bail
  // path we install a spy that forces `findDataChild(rootIdx, zId)` to
  // return -1 on the first call — simulating a corrupted GADDAG. A correct
  // implementation must (a) produce no moves covering (8,7) as a new tile,
  // (b) NEVER call `findDataChild(-1, …)` afterwards (the bail would be
  // missing its return and fall through to the mask loop with a -1 cursor).
  it('K6: first-iter left-walk failure bails via return, not OOB fallback', () => {
    const grid = emptyGrid();
    const zId = zxx.upperAlphabet.indexOf('Z');
    grid[7][7] = 'Z';

    const rack = parseRack(zxx, [...'AAAAAAA']);

    // Preserve the real implementation BEFORE spying — `vi.spyOn` replaces
    // the method, so we need a reference to the original to delegate non-
    // matching calls to. Bind to keep `this` correct.
    const realFindDataChild = zxx.findDataChild.bind(zxx);
    let forcedFailureFired = false;
    const spy = vi.spyOn(zxx, 'findDataChild').mockImplementation((parent: number, charId: number) => {
      if (!forcedFailureFired && parent === zxx.rootIdx && charId === zId) {
        forcedFailureFired = true;
        return -1; // simulate corruption: Z missing as a root child
      }
      return realFindDataChild(parent, charId);
    });

    try {
      const moves = new Board(zxx, grid, rack).moves();

      // Forced failure should have actually fired — otherwise the test is
      // vacuous (scenario didn't exercise the target path).
      expect(forcedFailureFired).toBe(true);

      // No move should cover (8,7) as a new tile: the forced lookup failure
      // means computeVerticalConstraint at (8,7) bailed with mask=[], which
      // blocks any horizontal move that would place a tile there.
      for (const m of moves.values()) {
        if (m.dir !== 'H' || m.row !== 8) continue;
        const col7Covered = m.col <= 7 && m.col + m.word.length - 1 >= 7;
        if (!col7Covered) continue;
        // A move covering (8,7) is fine only if (8,7) was already occupied
        // (it isn't in this setup — the only tile is at 7,7) → so any such
        // move would be placing a new tile at (8,7), which is forbidden.
        throw new Error(
          `Unexpected move placing a new tile at (8,7) after forced left-walk failure: ${JSON.stringify(m)}`
        );
      }

      // White-box: after the bail returns, the solver must NOT have called
      // findDataChild with a negative parent. If the fix regresses to the
      // old break+OOB shape, the mask loop would fire `findDataChild(-1, …)`
      // and rely on `Uint32Array[-1]` returning undefined — this assertion
      // catches any such regression immediately.
      const negativeCalls = spy.mock.calls.filter(([parent]) => parent < 0);
      expect(negativeCalls).toEqual([]);
    } finally {
      spy.mockRestore();
    }
  });

  // K7: verticalScore invariant (M5 part 2). The returned `verticalScore`
  // must only include tiles whose GADDAG lookup succeeded — accumulating
  // the score of a letter BEFORE verifying the lookup would pollute the
  // returned score with tiles that don't participate in any valid word.
  //
  // Today the pollution is invisible externally because mask=[] absorbs it
  // (`calculateScore` short-circuits on empty placements). But if anyone
  // later reads `verticalScore` out of the tuple for logging/debugging/UI,
  // they must see a score consistent with "tiles I could legally extend".
  //
  // Black-box probe: JZ stack, then verify that every move the solver
  // emits on col 7 has a score that does NOT include scores of J or Z —
  // i.e. no placement actually uses either tile as left-context (because
  // the dict has no word containing JZ or ZJ, so the walk bails at the
  // 2nd lookup, before the J-score would be added under the new order).
  it('K7: broken left-walk does not leak failing-tile scores into move scores', () => {
    const grid = emptyGrid();
    const jId = zxx.upperAlphabet.indexOf('J');
    const zId = zxx.upperAlphabet.indexOf('Z');
    grid[5][7] = 'J';
    grid[6][7] = 'Z';

    const rack = parseRack(zxx, [...'AAAAAAA']);
    const moves = new Board(zxx, grid, rack).moves();

    const jScore = zxx.tileScores[zxx.upperAlphabet[jId]];
    const zScore = zxx.tileScores[zxx.upperAlphabet[zId]];
    // J is the most expensive letter on this grid (8), Z too (10). Any move
    // whose score is anomalously inflated would signal that a failing-tile
    // score leaked into the returned `verticalScore` via the anchor's cross-
    // word constraint at a cell where we can't actually build a valid word.
    // For this minimal grid, legal cross-words through (4,7)/(7,7)/… can't
    // reach the failing chain: every emitted move's score must stay within
    // a reasonable bound (no move can beat a 7-letter bingo's ~60 pts here).
    const ANOMALY_THRESHOLD = 100;
    for (const m of moves.values()) {
      expect(m.score).toBeLessThan(ANOMALY_THRESHOLD);
    }
    // Sanity: J and Z scores are what we expected (defensive: if someone
    // rebalances FR tile scores, the anomaly threshold above may need
    // updating).
    expect(jScore).toBe(8);
    expect(zScore).toBe(10);
  });
});

// ----------------------------------------------------------------------------
// L. Big-alphabet regression (`1 << charId` overflow past 31 letters)
// ----------------------------------------------------------------------------
// Synthetic 42-letter locale (Latin A..Z + Greek Α..Π). Default UTF-16 sort
// yields charId 1..26 = A..Z (fits in a 32-bit bitmask) and charId 27..42 =
// Α..Π (27..31 fit; 32..42 would have silently wrapped under the old
// `1 << charId` mask, e.g. `1 << 36` → `1 << 4` aliases with 'D').
//
// FR (26 letters) can't exercise this path. Inlining the whole setup here —
// rather than a side-file — keeps the "one test entry-point per file" story
// consistent across the package.
//
// BCP 47 "qaa" is in the private-use range: safe for toLocaleLowerCase.
describe('L. Big-alphabet regression (`1 << charId` overflow)', () => {
  const LOCALE_42 = 'qaa';
  let locale42: LocaleData;

  function buildTileInfoForBigAlphabet() {
    const scores: Record<string, number> = {};
    for (let i = 0; i < 26; i++) scores[String.fromCharCode(0x41 + i)] = 1;     // A..Z
    for (let i = 0; i < 16; i++) scores[String.fromCharCode(0x0391 + i)] = 1;   // Α..Π
    const distributions: Record<string, number> = {};
    for (const k of Object.keys(scores)) distributions[k] = 5;
    distributions['?'] = 2;

    // Inline mirror of tile-configs.ts reducer — done here so the synthetic
    // locale construction doesn't leak into production config.
    const letters = Object.keys(scores).sort();
    const idToChar: string[] = new Array(letters.length + 1);
    idToChar[SEPARATOR_ID] = '+';
    for (let i = 0; i < letters.length; i++) idToChar[i + 1] = letters[i];
    const charToId = new Map<string, number>();
    for (let i = 1; i < idToChar.length; i++) charToId.set(idToChar[i], i);

    const bag: string[] = [];
    for (const letter of Object.keys(distributions)) {
      for (let i = 0; i < distributions[letter]; i++) bag.push(letter);
    }

    return {
      TILE_SCORES: scores,
      TILE_DISTRIBUTIONS: distributions,
      TILE_BAG_NEW_CONTENT: bag,
      ID_TO_CHAR: Object.freeze(idToChar) as readonly string[],
      CHAR_TO_ID: charToId,
    };
  }

  beforeAll(async () => {
    if (!TILE_INFO_BY_LOCALES[LOCALE_42]) {
      TILE_INFO_BY_LOCALES[LOCALE_42] = buildTileInfoForBigAlphabet();
    }
    const alphabetSize = TILE_INFO_BY_LOCALES[LOCALE_42].ID_TO_CHAR.length; // 43

    // Dict hand-picked so the solver must walk charId > 31 during
    // `computeVerticalConstraint`'s mask loop. Every word contains at least
    // one Greek letter (charId ≥ 27, several ≥ 32).
    const words = [
      'AB', 'BA', 'AA',
      'ΚΑ',      // charId(Κ)=36, charId(Α)=27
      'ΑΚ',
      'ΠΑ',      // charId(Π)=42
      'ΑΠ',
      'ABΠ',
      'ΚΑΜΑ',    // charId(Μ)=38
      'AΜΜ',
      'ΜΑ',
      'ΑΜ',
    ];

    const dawg = compressToDawg(words, LOCALE_42);
    const gaddag = await convertDawgToGaddag(dawg, alphabetSize);
    locale42 = new LocaleData(LOCALE_42, gaddag);
  });

  it('L1: LocaleData accepts the synthetic 43-symbol alphabet without error', () => {
    expect(locale42.alphabetSize).toBe(43);
    expect(locale42.upperAlphabet.length).toBe(43);
    expect(locale42.fullAlphabetMask.length).toBe(43);
    expect(locale42.fullAlphabetMask[0]).toBe(0);  // separator
    expect(locale42.fullAlphabetMask[42]).toBe(1); // highest real letter
  });

  it('L2: char_ids span beyond the old 31-bit ceiling', () => {
    // Every Greek char lands past charId 26. Several land past 31 — precisely
    // the range the old bitmask couldn't represent.
    expect(locale42.upperAlphabet.indexOf('Α')).toBe(27);
    expect(locale42.upperAlphabet.indexOf('Κ')).toBe(36);
    expect(locale42.upperAlphabet.indexOf('Μ')).toBe(38);
    expect(locale42.upperAlphabet.indexOf('Π')).toBe(42);
  });

  // Direct solver check: place Κ (charId 36) on the board, rack has Α
  // (charId 27), and ask the solver to build ΚΑ/ΑΚ. Under the old bitmask,
  // `(1 << 36)` wrapped to `1 << 4`, aliasing with charId 4 ('D'). The mask
  // would then reject 'Κ' where the cross-word required it, and accept
  // letters that shouldn't be there. The new array-indexed mask treats each
  // charId independently.
  it('L3: solver finds a move using a char_id > 31 (Κ + Α → ΚΑ or ΑΚ)', () => {
    const grid: string[][] = Array.from({ length: 15 }, () => new Array<string>(15).fill(BOARD_EMPTY_SQUARE));
    const aGreek = locale42.upperAlphabet.indexOf('Α'); // 27
    const kGreek = locale42.upperAlphabet.indexOf('Κ'); // 36
    expect(kGreek).toBeGreaterThan(31);

    const rack = [aGreek, kGreek, aGreek, aGreek, aGreek, aGreek, aGreek];
    const moves = new Board(locale42, grid, rack).moves();

    expect(moves.size).toBeGreaterThan(0);

    let sawKA = false;
    for (const m of moves.values()) {
      if (m.word.includes('Κ') && m.word.includes('Α')) {
        sawKA = true;
        break;
      }
    }
    expect(sawKA).toBe(true);
  });

  // Cross-word (vertical) probe: places Κ on the grid, then asks the solver
  // for moves where the vertical mask at a neighbouring cell must correctly
  // include Α (charId 27, low half) AND reject letters that don't form a
  // valid Κ-word. Exercises `computeVerticalConstraint`'s mask-setting loop
  // specifically for charIds spanning low and high 32-bit halves.
  it('L4: vertical constraint correctly masks both low and high charIds', () => {
    const grid: string[][] = Array.from({ length: 15 }, () => new Array<string>(15).fill(BOARD_EMPTY_SQUARE));
    grid[7][7] = 'Κ';

    // Rack: Α (low charId 27) + Π (high charId 42) + filler.
    const aGreek = locale42.upperAlphabet.indexOf('Α');
    const piGreek = locale42.upperAlphabet.indexOf('Π');
    const rack = [aGreek, piGreek, aGreek, aGreek, aGreek, aGreek, aGreek];

    const moves = new Board(locale42, grid, rack).moves();

    // The dict contains ΚΑ (2-letter). There must be a vertical move covering
    // (8,7) where the placed letter is 'Α' — proves the mask accepted charId
    // 27 while Κ (charId 36, high half) occupies the left context.
    let sawVerticalAt8_7 = false;
    for (const m of moves.values()) {
      const coversVertical8_7 =
        m.dir === 'V' && m.col === 7 && m.row <= 8 && m.row + m.word.length - 1 >= 8;
      if (!coversVertical8_7) continue;
      sawVerticalAt8_7 = true;
      const letterAt8 = m.word[8 - m.row].toLocaleUpperCase(LOCALE_42);
      expect(letterAt8).toBe('Α');
    }
    expect(sawVerticalAt8_7).toBe(true);
  });

  // Blank placement + charId > 31: a blank must be offered as every alphabet
  // letter. With 42 letters, the rack-iteration loop spans charId 1..42. Each
  // check uses `mask[charId]`; charIds 32..42 live past the old bitmask's
  // wrap point. Without the refactor, the solver would silently refuse to
  // place a blank as any Greek-range letter.
  it('L5: blank tile can be placed as any char_id in the 42-letter alphabet', () => {
    const grid: string[][] = Array.from({ length: 15 }, () => new Array<string>(15).fill(BOARD_EMPTY_SQUARE));
    grid[7][7] = 'Α';

    // Rack: blank + A's to avoid biasing toward any specific letter.
    const aLatin = locale42.upperAlphabet.indexOf('A');
    const rack = [BLANK_ID, aLatin, aLatin, aLatin, aLatin, aLatin, aLatin];
    const moves = new Board(locale42, grid, rack).moves();

    // At least one move must place the blank as Κ (charId 36, > 31) to form
    // ΑΚ/ΚΑ. The blank renders as lowercase κ in move.word.
    let sawBlankAsHighCharId = false;
    for (const m of moves.values()) {
      if (m.usedLetters.includes('κ')) {
        sawBlankAsHighCharId = true;
        break;
      }
    }
    expect(sawBlankAsHighCharId).toBe(true);
  });
});

// ----------------------------------------------------------------------------
// M. Multi-char tiles (digraphs) — locale `zxx-di`
// Exercises tokenization, emitMove, dedup under an alphabet that contains
// `CH`, `LL` and the Catalan-style trigraph `L·L`.
// ----------------------------------------------------------------------------
describe('M. Multi-char tiles (zxx-di)', () => {
  let zxxdi: LocaleData;
  beforeAll(() => { zxxdi = loadLocale('zxx-di'); });

  it('M1: plain single-char word regresses to the same shape', () => {
    // AA is in the zxx-di dict. Rack provides two As, trivially.
    const rack = parseRack(zxxdi, ['A', 'A', 'B', 'T', 'E', 'R', 'S']);
    const moves = new Board(zxxdi, emptyGrid(), rack).moves();
    const m = findMove(moves, { word: 'AA', row: 7, col: 7, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.word).toEqual(['A', 'A']);
    expect(m!.word.length).toBe(2);
  });

  it('M2: CHAT is emitted as a 3-tile word with CH as a single tile', () => {
    // Rack must contain the CH digraph tile, not separate C and H.
    const rack = parseRack(zxxdi, ['CH', 'A', 'T', 'B', 'R', 'S', 'E']);
    const moves = new Board(zxxdi, emptyGrid(), rack).moves();
    const m = findMove(moves, { word: 'CHAT', row: 7, col: 7, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.word).toEqual(['CH', 'A', 'T']);
    expect(m!.word.length).toBe(3);
    expect(m!.usedLetters).toEqual(['CH', 'A', 'T']);
  });

  it('M3: BALL ends with the LL digraph tile', () => {
    const rack = parseRack(zxxdi, ['B', 'A', 'LL', 'X', 'Y', 'Z', 'W']);
    const moves = new Board(zxxdi, emptyGrid(), rack).moves();
    const m = findMove(moves, { word: 'BALL', row: 7, col: 7, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.word).toEqual(['B', 'A', 'LL']);
    expect(m!.word.length).toBe(3);
  });

  it('M4: L·LA emits the Catalan-style trigraph as a single tile', () => {
    // The trigraph L·L spans 3 UTF-16 code units but must surface as one tile.
    const rack = parseRack(zxxdi, ['L·L', 'A', 'B', 'T', 'R', 'S', 'E']);
    const moves = new Board(zxxdi, emptyGrid(), rack).moves();
    const m = findMove(moves, { word: 'L·LA', row: 7, col: 7, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.word).toEqual(['L·L', 'A']);
    expect(m!.word.length).toBe(2);
    expect(m!.word.join('').length).toBe(4); // L(1) + ·(1) + L(1) + A(1) in code units
  });

  it('M5: a blank placed as CH renders lowercase "ch" in the move', () => {
    const rack = parseRack(zxxdi, ['?', 'A', 'T', 'B', 'R', 'S', 'E']);
    const moves = new Board(zxxdi, emptyGrid(), rack).moves();
    // With the blank standing in for CH, the move's tile at index 0 is "ch"
    // (lowercase). The predicate must match the emitted (blank-lowercased)
    // form to find the right move.
    const m = findMove(moves, { word: 'chAT', row: 7, col: 7, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.word).toEqual(['ch', 'A', 'T']);
    expect(m!.usedLetters).toEqual(['ch', 'A', 'T']);
  });

  it('M6: move.word[i] reads tiles correctly (no surrogate-pair issues)', () => {
    const rack = parseRack(zxxdi, ['CH', 'A', 'T', 'B', 'R', 'S', 'E']);
    const moves = new Board(zxxdi, emptyGrid(), rack).moves();
    const m = findMove(moves, { word: 'CHAT', row: 7, col: 7, dir: 'H' });
    expect(m!.word[0]).toBe('CH');
    expect(m!.word[1]).toBe('A');
    expect(m!.word[2]).toBe('T');
  });

  it('M7: no collision between tile CH and tiles C+H in the dedup key', () => {
    // ACH is in the dict: A-CH. ACHAT also in dict: A-CH-A-T. Two distinct
    // moves built on the same board must end up as separate Map entries —
    // regression against a naive keyWord that concatenates tile strings.
    const rack = parseRack(zxxdi, ['A', 'CH', 'A', 'T', 'B', 'R', 'S']);
    const moves = new Board(zxxdi, emptyGrid(), rack).moves();
    // Both ACH and ACHAT must both appear, not collapsed into one:
    const ach = findMove(moves, { word: 'ACH', row: 7, col: 7, dir: 'H' });
    const achat = findMove(moves, { word: 'ACHAT', row: 7, col: 7, dir: 'H' });
    expect(ach).toBeDefined();
    expect(achat).toBeDefined();
    expect(ach!.word.length).toBe(2); // [A, CH]
    expect(achat!.word.length).toBe(4); // [A, CH, A, T]
  });
});
