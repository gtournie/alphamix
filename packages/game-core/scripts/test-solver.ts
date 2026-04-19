// Manual smoke test — not part of the shipped game nor of any automated suite.
// Use this to eyeball the solver on a specific grid/rack. Code quality is
// deliberately relaxed here: loose typing, throwaway helpers are all fair game.
// Don't import from this file.
import fs from 'fs';
import path from 'path';
import { Board } from '../src2/core/game/Board';
import LocaleData from '../src2/core/game/locale/locale-data';
import { parseRack } from '../src2/core/game/__test-utils__/solver-fixtures';
import type { Move } from '../src2/core/game/types';

const LOCALE = 'fr';

const data = fs.readFileSync(path.resolve(import.meta.dir, `../dictionaries/gaddag/${LOCALE}.bin`));
const gaddagData = new Uint32Array(
  data.buffer,
  data.byteOffset,
  data.length / Uint32Array.BYTES_PER_ELEMENT
);

const localeData = new LocaleData(LOCALE, gaddagData);

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
].map(line => [...line]);

const board = new Board(localeData, grid, parseRack(localeData, 'PTBYE??'));
console.time('solve');
const moves = [...board.moves().values()];
console.timeEnd('solve');

if (moves.length) {
  console.log(`Found ${moves.length} moves`);
  const sorted = moves.sort((a, b) => a.score < b.score ? 1 : -1);

  sorted
    .slice(0, 1)
    .forEach((best) => {
      console.log('\n============================================\n');
      console.log(JSON.stringify(best));
      displayGrid(grid, best);
    });
} else {
  console.log('No moves found');
}

function displayGrid(grid: string[][], move: Move): void {
  grid.forEach((line, y) => {
    let lineOutput = '';
    let index = 0;
    let start = false;
    line.forEach((char, x) => {
      if (move.row === y && move.col === x) {
        start = true;
      }
      if (start === true && index < move.word.length) {
        if (grid[y][x] !== '.') {
          lineOutput += ' ' + move.word.charAt(index) + ' ';
        } else {
          lineOutput += ' \x1b[32m' + move.word.charAt(index) + '\x1b[0m ';
        }
        index++;
        return;
      }
      lineOutput += ' ' + char + ' ';
    });
    console.log(lineOutput);
  });
}
