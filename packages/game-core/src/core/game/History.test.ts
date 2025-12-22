import { describe, it, expect } from 'vitest';
import { History } from './History';
import { TILE_BLANK, HISTORY_DELIMITERS, TILE_DISTRIBUTION, HISTORY_ENTRY_DRAW_SEPARATOR } from './const';

const ALPHABET = Object.keys(TILE_DISTRIBUTION);
const FILTERED_ALPHABET = ALPHABET.filter(c => c !== TILE_BLANK);

function generateHistoryEntry() {
  // Define a string which will store the history entry
  let entry = '';

  // pick one delimiter randomly and add it to the entry
  const delimiters = Object.values(HISTORY_DELIMITERS);
  entry += delimiters[Math.floor(Math.random() * delimiters.length)];

  // pick a random number of chars (will be used for chars and drawn. drawn length may be shorter though)
  // this number should never be longer than 7. Could possibly be 0
  const numChars = Math.floor(Math.random() * 8);

  // generate random X and Y (use letters instead of numbers)
  // A:0 B:1 C:2 D:3 E:4 F:5 G:6 H:7 I:8 J:9 K:10 L:11 M:12 N:13 O:14 P:15
  const x = (Math.floor(Math.random() * 16)).toString(16).toUpperCase();
  const y = (Math.floor(Math.random() * 16)).toString(16).toUpperCase();
  entry += y + x;

  // generate 'chars' content. random chars from ALPHABET
  // look if there is any '?'. For each '?', add a random char from ALPHABET next to it (this must not be a '?')
  let chars = '';
  for (let i = 0; i < numChars; ++i) {
    let char = FILTERED_ALPHABET[Math.floor(Math.random() * FILTERED_ALPHABET.length)];
    if (Math.random() < 0.05) char = char.toLowerCase();
    chars += char;
  }
  entry += chars;

  // add DRAW_SEPARATOR
  entry += HISTORY_ENTRY_DRAW_SEPARATOR;

  // generate 'drawn' content. random chars from ALPHABET. drawn length may be SHORTER
  let drawn = '';
  let len = Math.floor(Math.random() * 5) === 0 ? Math.floor(Math.random() * (numChars + 1)) : numChars;
  for (let i = 0; i < len; ++i) {
    drawn += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  entry += drawn;

  // return it
  return entry;
}

function generateHistory(): string {
  let history = '';
  const length = Math.floor(Math.random() * 150) + 1;
  for (let i = 0; i < length; ++i) {
    history += generateHistoryEntry();
  }
  return history;
}

describe('History', () => {
  it('should be gameOver', () => {
    const history = '-73PESTES-67JEANS|44DEMRDaT-51HALZ|0APIFERET-B0LENIIVE|97FLGME-0BIQUE|70TYROiEN|19XI|1CUEL|22KAWS|13BAN|7BECOUAIS-59B|91USNT|14UN|9AHORA-C8ART|11RAM-E3LOUCDE-D5VOIE!!!!';
    expect(new History(history, 2, 1).isGameOver).toBe(true);
    expect(new History('-73PESTES-67JEANS!!!!', 2, 1).isGameOver).toBe(true);
    expect(new History('!!!!', 2, 1).isGameOver).toBe(true);
    expect(new History('!:!!!', 2, 1).isGameOver).toBe(true);
    expect(new History('!!!!:', 2, 1).isGameOver).toBe(true);
    expect(new History('-73PESTES-67JEANS!!!!!!', 3, 1).isGameOver).toBe(true);
  });

  it('should not be gameOver', () => {
    expect(new History('-73PESTES-67JEANS', 2, 1).isGameOver).toBe(false);
    expect(new History('-73PESTES-67JEANS!', 2, 1).isGameOver).toBe(false);
    expect(new History('-73PESTES-67JEANS!!', 2, 1).isGameOver).toBe(false);
    expect(new History('-73PESTES-67JEANS!!!', 2, 1).isGameOver).toBe(false);
    expect(new History('-73PESTES-67JEANS!A:B!!!', 2, 1).isGameOver).toBe(false);
    expect(new History('-73PESTES-67JEANS!!!!A:B', 2, 1).isGameOver).toBe(false);
    expect(new History('!!!!!', 3, 1).isGameOver).toBe(false);
  });

  // it('should encode and decode history properly a thousand times', () => {
  //   for (let i = 0; i < 1000; i++) {
  //     const history = generateHistory();
  //     const encoded = History.encode(history);
  //     const decoded = History.decode(encoded);
  //     expect(decoded).toBe(history);
  //   }
  // });
});