import { describe, it, expect } from 'vitest';
import { Board } from './Board';
import { HistoryEntry } from './HistoryEntry';
import { range } from './utils';


describe('board.checkLetters', () => {
  it('should be valid letters on an empty grid', () => {
    const grid = [
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
    ];
    const board = new Board(grid);
    let check;

    check = board.checkLetters('MAiSON'.split('').map((c, index) => ({ char: c, x: 2 + index, y: 7 })));
    expect(check.errors).toEqual({});
    expect(check.valid).toBe(true);
    expect(check.wordSpan?.word).toBe('MAiSON');
    expect(check.score).toBe(14);
    expect(check.crossWordSpans).toEqual([]);

    check = board.checkLetters('MAiSON'.split('').map((c, index) => ({ char: c, y: 2 + index, x: 7 })));
    expect(check.errors).toEqual({});
    expect(check.valid).toBe(true);
    expect(check.wordSpan?.word).toBe('MAiSON');
    expect(check.score).toBe(14);
    expect(check.crossWordSpans).toEqual([]);
  });

  it('should be valid letters on an simple grid', () => {
    const grid = [
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  E  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  X  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  E  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  m  A  I  S  O  N  .  .'.split('  '),
      '.  .  .  .  .  .  .  P  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  L  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  E  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .'.split('  '),
    ];
    const board = new Board(grid);
    let check;

    check = board.checkLetters([
      { char: 'E', x: 12, y: 3 },
      { char: 'M', x: 12, y: 4 },
      { char: 'M', x: 12, y: 5 },
      { char: 'E', x: 12, y: 6 },
      { char: 'E', x: 12, y: 8 },
      { char: 'Z', x: 12, y: 9 },
    ]);
    expect(check.errors).toEqual({});
    expect(check.valid).toBe(true);
    expect(check.wordSpan).toEqual({
      valid: true,
      word: 'EMMENEZ',
      coords: range(3, 9).map((y) => ({ x: 12, y }))
    });
    expect(check.score).toBe(20);
    expect(check.crossWordSpans).toEqual([]);

    check = board.checkLetters([
      { char: 'E', x: 4, y: 4 },
      { char: 'M', x: 5, y: 4 },
      { char: 'M', x: 6, y: 4 },
      { char: 'N', x: 8, y: 4 },
      { char: 'E', x: 9, y: 4 },
      { char: 'Z', x: 10, y: 4 },
    ]);
    expect(check.errors).toEqual({});
    expect(check.valid).toBe(true);
    expect(check.wordSpan).toEqual({
      valid: true,
      word: 'EMMENEZ',
      coords: range(4, 10).map((x) => ({ x, y: 4 }))
    });
    expect(check.score).toBe(72);
    expect(check.crossWordSpans).toEqual([]);

    check = board.checkLetters([
      { char: 'B', x: 6, y: 2 },
      { char: 'A', x: 6, y: 3 },
      { char: 'S', x: 6, y: 4 },
      { char: 'E', x: 6, y: 5 },
    ]);
    expect(check.errors).toEqual({});
    expect(check.valid).toBe(true);
    expect(check.wordSpan).toEqual({
      valid: true,
      word: 'BASE',
      coords: range(2, 5).map((y) => ({ x: 6, y }))
    });
    expect(check.score).toBe(22);
    expect(check.crossWordSpans?.sort()).toEqual([
      {
        valid: true,
        word: "SE",
        coords: [{ x: 6, y: 4 }, { x: 7, y: 4 }]
      },
      {
        valid: true,
        word: "EX",
        coords: [{ x: 6, y: 5 }, { x: 7, y: 5 }]
      },
    ].sort());
  });
});

// TODO: check Errors when invalid history
describe('Board.buildFromHistory', () => {
  it('should create an empty board with an empty history', () => {
    const history = '';
    const board = Board.buildFromHistory(history);
    const grid = board.hGrid;
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        expect(grid[y][x].isEmpty).toBe(true);
      }
    }
    expect(board.check().valid).toBe(true);
  });

  it('should populate the grid correctly from a valid history string', () => {
    //  E
    //  X
    //  E  I
    //  MAISON
    //  P  O
    //  L
    //  E
    const history = '|77EXEmPLE:GHIHMTR-A8AISON:NAAYS|9AIO:QP';
    const board = Board.buildFromHistory(history);

    expect(board.hGrid[7][7].tileChar).toBe('E');
    expect(board.hGrid[8][7].tileChar).toBe('X');
    expect(board.hGrid[9][7].tileChar).toBe('E');
    expect(board.hGrid[10][7].tileChar).toBe('M');
    expect(board.hGrid[10][7].isBlank).toBe(true);
    expect(board.hGrid[11][7].tileChar).toBe('P');
    expect(board.hGrid[12][7].tileChar).toBe('L');
    expect(board.hGrid[13][7].tileChar).toBe('E');

    expect(board.hGrid[10][8].tileChar).toBe('A');
    expect(board.hGrid[10][9].tileChar).toBe('I');
    expect(board.hGrid[10][10].tileChar).toBe('S');
    expect(board.hGrid[10][11].tileChar).toBe('O');
    expect(board.hGrid[10][12].tileChar).toBe('N');

    expect(board.hGrid[9][10].tileChar).toBe('I');
    expect(board.hGrid[11][10].tileChar).toBe('O');

    expect(board.check().valid).toBe(true);
  });

  it('should play a word and calculate the score correctly', () => {
    //       E
    //  E    M
    //  X    M
    //  E  I E
    //  MAISON
    //  P  O E
    //  L    Z
    //  E
    const history = '|77EXEmPLE:GHIHMTR-A8AISON:NAAYS|9AIO:QP';
    const board = Board.buildFromHistory(history);

    let { score } = board.playWord(new HistoryEntry('|6CEMMEEZ'));
    expect(score).toBe(42);
    expect(board.check().valid).toBe(true);
  });

  it('should handle a complex history', () => {
    const history = '-73PESTES-67JEANS|44DEMRDaT-51HALZ|0APIFERET-B0LENIIVE|97FLGME-0BIQUE|70TYROiEN|19XI|1CUEL|22KAWS|13BAN|7BECOUAIS-59B|91USNT|14UN|9AHORA-C8ART|11RAM-E3LOUCDE-D5VOIE-95O';
    const board = Board.buildFromHistory(history);
    const grid = [
      '.  .  .  .  .  .  .  .  .  .  P  I  Q  U  E'.split('  '),
      '.  R  .  B  U  .  .  .  .  X  I  .  U  .  .'.split('  '),
      '.  A  K  A  N  .  .  .  .  I  F  .  E  .  .'.split('  '),
      '.  M  A  N  .  .  .  .  .  .  E  .  L  .  .'.split('  '),
      '.  .  W  .  D  .  .  .  .  .  R  .  .  .  .'.split('  '),
      '.  H  A  L  E  Z  .  .  .  B  E  .  .  .  .'.split('  '),
      '.  .  S  .  M  .  .  J  E  A  N  S  .  .  .'.split('  '),
      'T  .  .  P  E  S  T  E  S  .  T  E  .  .  .'.split('  '),
      'Y  .  .  .  R  .  .  .  .  .  .  C  .  .  .'.split('  '),
      'R  U  .  .  D  O  .  F  .  .  H  O  .  .  .'.split('  '),
      'O  S  .  .  a  .  .  L  .  .  O  U  .  .  .'.split('  '),
      'L  E  N  I  T  I  V  E  .  .  R  A  .  .  .'.split('  '),
      'i  N  .  .  .  .  .  G  A  R  A  I  T  .  .'.split('  '),
      'E  T  .  .  .  V  O  M  I  E  .  S  .  .  .'.split('  '),
      'N  .  .  L  O  U  C  E  D  E  .  .  .  .  .'.split('  ')
    ];

    expect(board.originalHGrid).toEqual(grid);
  });

  it('should handle a complex history with multiple turns', () => {
    let score, wordSpan, crossWordSpans;

    // console.time('playWords');
    // for (let i = 0; i < 1; i++) {
    //   const board = Board.buildFromHistory(2, 1, '');
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-73PESTES')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-67JEANS')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|44DEMRDaT')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-51HALZ')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|0APIFERET')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-B0LENIIVE')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|97FLGME')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-0BIQUE')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|70TYROiEN')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|19XI')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|1CUEL')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|22KAWS')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|13BAN')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|7BECOUAIS')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-59B')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|91USNT')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|14UN')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|9AHORA')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-C8ART')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|11RAM')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-E3LOUCDE')));
    //   ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-D5VOIE')));
    // }
    // console.timeEnd('playWords');
    // return;

    const board = Board.buildFromHistory('');

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-73PESTES')));
    expect(wordSpan?.word).toBe('PESTES');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(22);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-67JEANS')));
    expect(wordSpan?.word).toBe('JEANS');
    expect(crossWordSpans?.map(s => s.word).sort()).toEqual(['JE', 'ES'].sort());
    expect(score).toBe(25);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|44DEMRDaT')));
    expect(wordSpan?.word).toBe('DEMERDaT');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(90);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-51HALZ')));
    expect(wordSpan?.word).toBe('HALEZ');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(45);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|0APIFERET')));
    expect(wordSpan?.word).toBe('PIFERENT');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(76);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-B0LENIIVE')));
    expect(wordSpan?.word).toBe('LENITIVE');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(76);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|97FLGME')));
    expect(wordSpan?.word).toBe('FLEGME');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(33);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-0BIQUE')));
    expect(wordSpan?.word).toBe('PIQUE');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(45);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|70TYROiEN')));
    expect(wordSpan?.word).toBe('TYROLiEN');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(194);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|19XI')));
    expect(wordSpan?.word).toBe('XI');
    expect(crossWordSpans?.map(s => s.word).sort()).toEqual(['IF', 'XI'].sort());
    expect(score).toBe(67);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|1CUEL')));
    expect(wordSpan?.word).toBe('QUEL');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(22);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|22KAWS')));
    expect(wordSpan?.word).toBe('KAWAS');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(48);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|13BAN')));
    expect(wordSpan?.word).toBe('BAN');
    expect(crossWordSpans?.map(s => s.word).sort()).toEqual(['KA', 'AN'].sort());
    expect(score).toBe(25);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|7BECOUAIS')));
    expect(wordSpan?.word).toBe('SECOUAIS');
    expect(crossWordSpans?.map(s => s.word).sort()).toEqual(['TE'].sort());
    expect(score).toBe(75);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-59B')));
    expect(wordSpan?.word).toBe('BE');
    expect(crossWordSpans?.map(s => s.word).sort()).toEqual(['BA'].sort());
    expect(score).toBe(20);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|91USNT')));
    expect(wordSpan?.word).toBe('USENT');
    expect(crossWordSpans?.map(s => s.word).sort()).toEqual(['RU', 'OS', 'IN', 'ET'].sort());
    expect(score).toBe(25);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|14UN')));
    expect(wordSpan?.word).toBe('UN');
    expect(crossWordSpans?.map(s => s.word).sort()).toEqual(['BU', 'KAN'].sort());
    expect(score).toBe(18);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|9AHORA')));
    expect(wordSpan?.word).toBe('HORA');
    expect(crossWordSpans?.map(s => s.word).sort()).toEqual(['HO', 'OU', 'RA', 'AI'].sort());
    expect(score).toBe(27);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-C8ART')));
    expect(wordSpan?.word).toBe('GARAIT');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(16);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('|11RAM')));
    expect(wordSpan?.word).toBe('RAM');
    expect(crossWordSpans?.map(s => s.word).sort()).toEqual(['MAN', 'AKAN'].sort());
    expect(score).toBe(25);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-E3LOUCDE')));
    expect(wordSpan?.word).toBe('LOUCEDE');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(11);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-D5VOIE')));
    expect(wordSpan?.word).toBe('VOMIE');
    expect(crossWordSpans?.map(s => s.word).sort()).toEqual(['VU', 'OC', 'AID', 'REE'].sort());
    expect(score).toBe(45);
    expect(board.check().valid).toBe(true);

    ({ score, wordSpan, crossWordSpans } = board.playWord(new HistoryEntry('-95O')));
    expect(wordSpan?.word).toBe('DO');
    expect(crossWordSpans?.map(s => s.word)).toEqual([]);
    expect(score).toBe(5);
    expect(board.check().valid).toBe(true);
  });



  // it('should leave the grid empty for an empty history string', () => {
  //   const emptyGrid = Array(15).fill(null).map(() => Array(15).fill('.'));
  //   const board = new Board(emptyGrid);

  //   const history = '';
  //   board.buildFromHistory(history);

  //   for (let y = 0; y < 15; y++) {
  //     for (let x = 0; x < 15; x++) {
  //       expect(board.grid[y][x]).toBe(Tile.EMPTY);
  //     }
  //   }
  // });

  // it('should handle invalid history strings gracefully', () => {
  //   const emptyGrid = Array(15).fill(null).map(() => Array(15).fill('.'));
  //   const board = new Board(emptyGrid);

  //   const invalidHistory = 'INVALID_HISTORY';
  //   expect(() => board.buildFromHistory(invalidHistory)).not.toThrow();

  //   for (let y = 0; y < 15; y++) {
  //     for (let x = 0; x < 15; x++) {
  //       expect(board.grid[y][x]).toBe(Tile.EMPTY);
  //     }
  //   }
  // });
});