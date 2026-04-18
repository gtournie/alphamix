import { beforeAll, describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Board } from './solver';
import LocaleData from './locale/locale-data';
import {
  loadLocale,
  emptyGrid,
  parseGrid,
  parseRack,
  findMove,
  mustFindMove,
  bestMove,
  sortMoves,
} from './__test-utils__/solver-fixtures';
import type { Move } from './types';
import { BLANK_ID, EMPTY_ID, TILE_RACK_SIZE } from './const';

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
    const rack = parseRack(zxx, 'BASECAR');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
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
    const rack = parseRack(zxx, 'BASECAR');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    const base = findMove(moves, { word: 'BASE' });
    expect(base).toBeDefined();
    expect(base!.score).toBeGreaterThan(0);
  });

  it('A2: first move through center (7,7) applies the W2 bonus', () => {
    const rack = parseRack(zxx, 'PATEZER');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    const pate = findMove(moves, { word: 'PATE', row: 7, col: 7, dir: 'H' });
    expect(pate).toBeDefined();
    expect(pate!.score).toBe(12);
  });

  it('A5: no valid word = empty result set', () => {
    const rack = parseRack(zxx, 'KKKKKKK');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    expect(moves.size).toBe(0);
  });

  it('A6: first move of 7 tiles triggers the +50 bingo bonus', () => {
    const rack = parseRack(zxx, 'BATEAUX');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    const m = findMove(moves, { word: 'BATEAUX', row: 7, col: 7, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.usedLetters).toBe('BATEAUX');
    expect(m!.score).toBe(88);
  });
});

// ----------------------------------------------------------------------------
// B. Anchors & connectivity (mid-game, rack = 7)
// ----------------------------------------------------------------------------
describe('B. Anchors and connectivity', () => {
  function gridWithChat(): number[][] {
    const g = emptyGrid();
    return parseGrid(zxx, [
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
    ]);
  }

  it('B1: every move touches or overlaps a pre-placed tile area', () => {
    const grid = gridWithChat();
    const rack = parseRack(zxx, 'ESACBRT');
    const moves = new Board(zxx, grid, rack).solve();
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
    const rack = parseRack(zxx, 'ESACBRT');
    const moves = new Board(zxx, grid, rack).solve();
    for (const m of moves.values()) {
      const startsInRemote = m.row <= 4 && m.col <= 4
        && (m.dir === 'H' ? m.col + m.word.length - 1 <= 4 : m.row + m.word.length - 1 <= 4);
      expect(startsInRemote).toBe(false);
    }
  });

  it('B4: suffix extension — add letters on the right of an existing word', () => {
    const grid = gridWithChat();
    const rack = parseRack(zxx, 'SZZZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const chats = findMove(moves, { word: 'CHATS', row: 7, col: 7, dir: 'H' });
    expect(chats).toBeDefined();
    expect(chats!.usedLetters).toBe('S');
    expect(chats!.score).toBe(11);
  });

  it('B3: prefix extension — add letters on the left of an existing word', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'RZZZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const rose = findMove(moves, { word: 'ROSE', row: 7, col: 6, dir: 'H' });
    expect(rose).toBeDefined();
    expect(rose!.usedLetters).toBe('R');
    expect(rose!.score).toBe(4);
  });

  it('B5: through-extension — a new word reuses pre-placed tiles in the middle', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'BESZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const bases = findMove(moves, { word: 'BASES', row: 7, col: 6, dir: 'H' });
    expect(bases).toBeDefined();
    expect(bases!.usedLetters).toBe('BES');
    expect(bases!.score).toBe(7);
  });

  it('B6: parallel placement creates valid cross-words on every shared column', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'TASZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
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
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'ASZZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const as = findMove(moves, { word: 'AS', row: 8, col: 7, dir: 'H' });
    expect(as).toBeDefined();
    expect(as!.score).toBe(8);
  });

  it('C2: a move creating an invalid cross-word is filtered out', () => {
    // Under Z at (7,7) only ZE is valid vertically. Any horizontal move placing a tile at
    // (8,7) must therefore have E in that position.
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'TAZZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const badMove = findMove(moves, { word: 'TA', row: 8, col: 7, dir: 'H' });
    expect(badMove).toBeUndefined();
    for (const m of moves.values()) {
      if (m.dir === 'H' && m.row === 8 && m.col <= 7 && m.col + m.word.length > 7) {
        const ch = m.word.charAt(7 - m.col).toUpperCase();
        expect(ch === 'E').toBe(true);
      }
    }
  });

  it('C3: multiple cross-words add their scores independently', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'TASZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const tas = findMove(moves, { word: 'TAS', row: 8, col: 7, dir: 'H' });
    expect(tas).toBeDefined();
    expect(tas!.score).toBe(11);
  });

  it('C4: pure extension produces no cross-word, only the main-word score', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'SZZZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const chats = findMove(moves, { word: 'CHATS', row: 7, col: 7, dir: 'H' });
    expect(chats).toBeDefined();
    expect(chats!.score).toBe(11);
  });

  it('C5: shortest legal move — 1 new tile + 1 pre-placed = 2-letter word', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'TZZZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const te = findMove(moves, { word: 'TE', row: 6, col: 7, dir: 'V' });
    expect(te).toBeDefined();
    expect(te!.usedLetters).toBe('T');
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
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'SZZZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const chats = findMove(moves, { word: 'CHATS', row: 7, col: 7, dir: 'H' });
    expect(chats!.score).toBe(11);
  });

  it('D8: +50 bingo bonus applies when all 7 rack tiles are placed', () => {
    const rack = parseRack(zxx, 'BATEAUX');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    const m = findMove(moves, { word: 'BATEAUX', row: 7, col: 7, dir: 'H' });
    expect(m!.usedLetters.length).toBe(TILE_RACK_SIZE);
    expect(m!.score).toBe(88);
  });

  it('D9: no +50 bonus when one of the 7-letter word tiles was pre-placed', () => {
    // Play BATEAUX by reusing the pre-placed A at (7,7). Only 6 tiles come from the rack,
    // so the bingo bonus does not trigger.
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'BTEAUXZ');
    const moves = new Board(zxx, grid, rack).solve();
    const m = findMove(moves, { word: 'BATEAUX', row: 7, col: 6, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.usedLetters.length).toBe(6);
    expect(m!.score).toBe(19);
  });

  it('D10: two W3 bonuses compound multiplicatively (×9)', () => {
    // Play RATERONS on row 0 covering both W3 at (0,0) and (0,7). The word multiplier must
    // be 3×3 = 9 (not 3+3).
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'RATRONS');
    const moves = new Board(zxx, grid, rack).solve();
    const m = findMove(moves, { word: 'RATERONS', row: 0, col: 0, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.usedLetters).toBe('RATRONS');
    expect(m!.score).toBe(122);
  });

  it('D10b: multiple cross-words from a single placement sum independently', () => {
    // Play MAITRES with two cross-words formed simultaneously: ZE at col 7 and ES at col 8.
    // The main word score and each cross-word score must all contribute.
    const grid = parseGrid(zxx, [
      '...............',
      '...........ECHO',
      '...........S..R',
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
    ]);
    const rack = parseRack(zxx, 'MAITRES');
    const moves = new Board(zxx, grid, rack).solve();
    const m = mustFindMove(moves, { word: 'MAITRES', row: 4, col: 2, dir: 'H' });
    expect(m.score).toBe(79);
  });

  it('D11: W2 bonus multiplies both the main word and the cross-word passing through it', () => {
    // Play CA so that C lands on W2(2,2) with a pre-placed A at (3,2) forming cross-word CA.
    // The W2 bonus at (2,2) must apply to both axes.
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'CAZZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const m = mustFindMove(moves, { word: 'CA', row: 2, col: 2, dir: 'H' });
    expect(m.score).toBe(16);
  });

  it('D1: L2 bonus doubles the letter score', () => {
    // Play CAS over TE so that A lands on L2 at (6,8). Cross-word CE at col 7.
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'CASZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const m = findMove(moves, { word: 'CAS', row: 6, col: 7, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(10);
  });

  it('D2: L3 bonus triples the letter score', () => {
    // Play CAS so that C lands on L3 at (5,5). Cross-word CE at col 5.
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'CASZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const m = findMove(moves, { word: 'CAS', row: 5, col: 5, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(21);
  });

  it('D3: W2 bonus doubles the word score', () => {
    // Play CAS so that C lands on W2 at (1,1). Cross-word CE at col 1.
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'CASZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const m = findMove(moves, { word: 'CAS', row: 1, col: 1, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(18);
  });

  it('D4: W3 bonus triples the word score', () => {
    // Play CAS so that C lands on W3 at (0,0). Cross-word CAS at col 0 (extends AS vertical).
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'CASZZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const m = findMove(moves, { word: 'CAS', row: 0, col: 0, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(30);
  });

  it('D5: L2 and W2 bonuses combined on same move', () => {
    // Play CARS so that C lands on L2(3,0) and S lands on W2(3,3). Cross-word CAS at col 0.
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'CARSZZZ');
    const moves = new Board(zxx, grid, rack).solve();
    const m = findMove(moves, { word: 'CARS', row: 3, col: 0, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(26);
  });

  it('D7: W2 bonus also multiplies the cross-word', () => {
    // Play CAS so that C lands on W2 at (1,1). The W2 must apply to both the main word
    // AND the cross-word passing through that cell.
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'ASCXYWZ');
    const moves = new Board(zxx, grid, rack).solve();
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
    const rack = parseRack(zxx, 'BAS?STA');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    let found: Move | undefined;
    for (const m of moves.values()) {
      if (/[a-z]/.test(m.word)) { found = m; break; }
    }
    expect(found).toBeDefined();
    expect(found!.usedLetters).toMatch(/[a-z]/);
  });

  it('E2: a blank contributes 0 to the letter sum (even on a W2)', () => {
    const rack = parseRack(zxx, 'BAS?ZZZ');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    let base: Move | undefined;
    for (const mv of moves.values()) {
      if (mv.word.toUpperCase() === 'BASE' && mv.row === 7 && mv.col === 7 && mv.dir === 'H') {
        base = mv;
      }
    }
    expect(base).toBeDefined();
    expect(base!.score).toBe(10);
    expect(base!.usedLetters).toMatch(/e/);
  });

  it('E3: a rack with two blanks does not blow up the combinatorial search', () => {
    const rack = parseRack(zxx, 'BASE??Z');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    expect(moves.size).toBeGreaterThan(0);
  });

  it('E4: a blank is restricted by cross-word validity like any letter', () => {
    // Under Z at (7,7), only ZE is valid vertically. A blank placed at (8,7) can therefore
    // only represent E — the cross-word bitmask constrains blanks too.
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, '?AISAIS');
    const moves = new Board(zxx, grid, rack).solve();
    // Any move placing at (8,7) must have letter 'E' (or 'e' as blank) in that position
    for (const m of moves.values()) {
      if (m.dir === 'V' && m.col === 7 && m.row <= 8 && m.row + m.word.length - 1 >= 8) {
        const ch = m.word.charAt(8 - m.row).toUpperCase();
        expect(ch).toBe('E');
      }
      if (m.dir === 'H' && m.row === 8) {
        const cIdx = 7 - m.col;
        if (cIdx >= 0 && cIdx < m.word.length) {
          const ch = m.word.charAt(cIdx).toUpperCase();
          expect(ch).toBe('E');
        }
      }
    }
  });

  it('E5: W3 still multiplies the word even when a blank lands on the bonus square', () => {
    // The blank contributes 0 to the letter sum, but the W3 bonus must still triple the
    // horizontal word and the cross-word passing through that cell.
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, '?ASXWYZ');
    const moves = new Board(zxx, grid, rack).solve();
    let m: Move | undefined;
    for (const mv of moves.values()) {
      if (mv.word.toUpperCase() === 'CAS' && mv.row === 0 && mv.col === 0 && mv.dir === 'H'
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
    const rack = parseRack(zxx, '??');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    let zeroScore: Move | undefined;
    for (const m of moves.values()) {
      if (m.score === 0 && m.usedLetters.length === 2 && /^[a-z]{2}$/.test(m.usedLetters)) {
        zeroScore = m;
        break;
      }
    }
    expect(zeroScore).toBeDefined();
    expect(zeroScore!.score).toBe(0);
  });
});

// ----------------------------------------------------------------------------
// F. Edges and borders
// ----------------------------------------------------------------------------
describe('F. Edges', () => {
  it('F1: a move on row 0 does not read out of bounds above the board', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'ETKXWYZ');
    const moves = new Board(zxx, grid, rack).solve();
    expect(moves.size).toBeGreaterThan(0);
    const et = findMove(moves, { word: 'ET', row: 0, col: 6, dir: 'H' });
    expect(et).toBeDefined();
    expect(et!.score).toBe(12);
  });

  it('F2: a move on row 14 does not read out of bounds below the board', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'ETKXYWZ');
    const moves = new Board(zxx, grid, rack).solve();
    const et = findMove(moves, { word: 'ET', row: 14, col: 6, dir: 'H' });
    expect(et).toBeDefined();
    expect(et!.score).toBe(12);
  });

  it('F6: a move ending exactly at col 14 does not overflow to col 15', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'AJKXWYZ');
    const moves = new Board(zxx, grid, rack).solve();
    const at = findMove(moves, { word: 'AT', row: 7, col: 13, dir: 'H' });
    expect(at).toBeDefined();
    expect(at!.score).toBe(2);
  });

  it('F3: a 7-letter bingo on the last row scores correctly (W3 + cross-word + +50)', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'BATEAUX');
    const moves = new Board(zxx, grid, rack).solve();
    const m = findMove(moves, { word: 'BATEAUX', row: 14, col: 4, dir: 'H' });
    expect(m).toBeDefined();
    expect(m!.score).toBe(113);
  });

  it('F4: a heavily populated board returns a coherent move set without crashing', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'MESTA??');
    const moves = new Board(zxx, grid, rack).solve();
    expect(moves).toBeInstanceOf(Map);
  });

  it('F5: endgame — a rack of a single tile can still produce a move', () => {
    // End-of-bag scenario: the rack holds less than 7 tiles. solve() should still find any
    // valid 2-letter move that reuses a pre-placed tile.
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'T');
    const moves = new Board(zxx, grid, rack).solve();
    const et = findMove(moves, { word: 'ET', row: 7, col: 7, dir: 'H' });
    expect(et).toBeDefined();
  });
});

// ----------------------------------------------------------------------------
// G. Horizontal vs Vertical, determinism
// ----------------------------------------------------------------------------
describe('G. Directionality & determinism', () => {
  it('G1: the move list has no duplicate (word, row, col, dir) entries', () => {
    const rack = parseRack(zxx, 'BASECAR');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    const keys = new Set<string>();
    for (const m of moves.values()) {
      const k = `${m.word.toUpperCase()}${m.row}${m.dir}${m.col}`;
      expect(keys.has(k)).toBe(false);
      keys.add(k);
    }
  });

  it('G2: the same word placed horizontally and vertically yields two distinct moves', () => {
    const rack = parseRack(zxx, 'BASEZZZ');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    const bh = findMove(moves, { word: 'BASE', dir: 'H' });
    const bv = findMove(moves, { word: 'BASE', dir: 'V' });
    expect(bh).toBeDefined();
    expect(bv).toBeDefined();
    expect(bh).not.toEqual(bv);
  });

  it('G4: solve() is deterministic — two runs on the same input produce identical results', () => {
    const rack1 = parseRack(zxx, 'BASECAR');
    const rack2 = parseRack(zxx, 'BASECAR');
    const r1 = sortMoves(new Board(zxx, emptyGrid(), rack1).solve().values());
    const r2 = sortMoves(new Board(zxx, emptyGrid(), rack2).solve().values());
    expect(r1).toEqual(r2);
  });
});

// ----------------------------------------------------------------------------
// H. Regression on real FR grid
// ----------------------------------------------------------------------------
describe('H. FR regression', () => {
  it('H1: full move list on a real FR mid-game grid matches the committed fixture', () => {
    const toFrId = (() => {
      const map = new Array<number>(65536).fill(EMPTY_ID);
      fr.alphabet.forEach((c, index) => { map[c.charCodeAt(0)] = index; });
      return (c: string) => (c === '?' ? BLANK_ID : (map[c.charCodeAt(0)] ?? EMPTY_ID));
    })();

    const grid = [
      '               ',
      '           T V ',
      '          JOUES',
      '           N L ',
      '          AN A ',
      '       MOFLE TA',
      '    G     O   X',
      '   BADER  I   A',
      '    R WURMS   I',
      '  FADEE       U',
      '    E SALEE    ',
      'T ZOU  HIT     ',
      'I E R          ',
      'POKES          ',
      'E              ',
    ].map(l => [...l].map(toFrId));
    const rack = [...'PTBYE??'].map(toFrId);

    const board = new Board(fr, grid, rack);
    const actual = sortMoves(board.solve().values());
    const fixturePath = path.resolve(__dirname, '__test-utils__/h1-moves.json');
    const expected = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as Move[];
    expect(actual).toEqual(expected);
  });

  it('H2: FR dictionary — CHAT extends to CHATS with L2 bonus on S', () => {
    // Pre-place CHAT at (7,7-10) in FR.
    const toFrId = (() => {
      const map = new Array<number>(65536).fill(EMPTY_ID);
      fr.alphabet.forEach((c, index) => { map[c.charCodeAt(0)] = index; });
      return (c: string) => (c === '?' ? BLANK_ID : (c === '.' || c === ' ' ? EMPTY_ID : (map[c.charCodeAt(0)] ?? EMPTY_ID)));
    })();
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
    ].map(l => [...l].map(toFrId));
    const rack = [...'SBATEAU'].map(toFrId);
    const moves = new Board(fr, grid, rack).solve();
    const chats = findMove(moves, { word: 'CHATS', row: 7, col: 7, dir: 'H' });
    expect(chats).toBeDefined();
    expect(chats!.usedLetters).toBe('S');
    // CHAT pre-placed 9 + S on L2 (2) = 11 (same calc as B4/D6)
    expect(chats!.score).toBe(11);
  });
});

// ----------------------------------------------------------------------------
// I. Performance
// ----------------------------------------------------------------------------
describe('I. Performance', () => {
  it('I1: solve() finishes under 100ms on a FR mid-game grid with 2 blanks in the rack', () => {
    // Reuse the exact H1 setup
    const toFrId = (() => {
      const map = new Array<number>(65536).fill(EMPTY_ID);
      fr.alphabet.forEach((c, index) => { map[c.charCodeAt(0)] = index; });
      return (c: string) => (c === '?' ? BLANK_ID : (map[c.charCodeAt(0)] ?? EMPTY_ID));
    })();
    const grid = [
      '               ',
      '           T V ',
      '          JOUES',
      '           N L ',
      '          AN A ',
      '       MOFLE TA',
      '    G     O   X',
      '   BADER  I   A',
      '    R WURMS   I',
      '  FADEE       U',
      '    E SALEE    ',
      'T ZOU  HIT     ',
      'I E R          ',
      'POKES          ',
      'E              ',
    ].map(l => [...l].map(toFrId));
    const rack = [...'PTBYE??'].map(toFrId);

    const board = new Board(fr, grid, rack);
    const t0 = performance.now();
    board.solve();
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
    const rack = parseRack(zxx, 'BASECAR');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    for (const m of moves.values()) {
      expect(m.usedLetters.length).toBeGreaterThanOrEqual(1);
      expect(m.usedLetters.length).toBeLessThanOrEqual(TILE_RACK_SIZE);
    }
  });

  it('J2: no returned move is a single-letter word', () => {
    const rack = parseRack(zxx, 'BASECAR');
    const moves = new Board(zxx, emptyGrid(), rack).solve();
    for (const m of moves.values()) {
      expect(m.word.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('J3: a move never overwrites a pre-placed tile with a different letter', () => {
    const grid = parseGrid(zxx, [
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
    ]);
    const rack = parseRack(zxx, 'ESACBRT');
    const moves = new Board(zxx, grid, rack).solve();
    for (const m of moves.values()) {
      for (let i = 0; i < m.word.length; i++) {
        const r = m.dir === 'H' ? m.row : m.row + i;
        const c = m.dir === 'H' ? m.col + i : m.col;
        const existing = grid[r][c];
        if (existing !== EMPTY_ID) {
          expect(m.word.charAt(i).toUpperCase()).toBe(zxx.alphabet[existing]);
        }
      }
    }
  });

  it('J4: solve() on an empty rack returns an empty result set (defensive)', () => {
    const moves = new Board(zxx, emptyGrid(), []).solve();
    expect(moves.size).toBe(0);
  });
});
