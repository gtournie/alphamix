// Manual smoke test — not part of the shipped game nor of any automated suite.
// Use this to eyeball the solver on a specific grid/rack. Code quality is
// deliberately relaxed here: private-field access, loose typing, throwaway
// helpers are all fair game. Don't import from this file.
import fs from 'fs';
import path from 'path';
import { Board } from '../src2/core/game/solver.js';
import LocaleData from '../src2/core/game/locale/locale-data.js';
import { BLANK_ID, EMPTY_ID, TILE_BLANK } from '../src2/core/game/const';

const LOCALE = 'fr';

const data = fs.readFileSync(path.resolve(import.meta.dir, `../dictionaries/gaddag/${LOCALE}.bin`));
const gaddagData = new Uint32Array(
  data.buffer,
  data.byteOffset,
  data.length / Uint32Array.BYTES_PER_ELEMENT
);

const localeData = new LocaleData(LOCALE, gaddagData);

const toCharId = (c: string): number => {
  if (c === TILE_BLANK) return BLANK_ID;
  if (c === '.' || c === ' ') return EMPTY_ID; // grid placeholders
  return localeData.charToId(c); // throws on unknown — catches typos in the grid
};

const grid = [
  // 123456789012345
  "               ", // 0
  "           T V ", // 1
  "          JOUES", // 2
  "           N L ", // 3
  "          AN A ", // 4
  "       MOFLE TA", // 5
  "    G     O   X", // 6
  "   BADER  I   A", // 7
  "    R WURMS   I", // 8
  "  FADEE       U", // 9
  "    E SALEE    ", // 10
  "T ZOU  HIT     ", // 11
  "I E R          ", // 12
  "POKES          ", // 13
  "E              ", // 14
].map(line => line.split('').map(toCharId));

const board = new Board(localeData, grid, 'PTBYE??'.split('').map(toCharId))
console.time('solve');
const moves = [...board.solve().values()];
console.timeEnd('solve');

if (moves.length) {
  console.log(`Found ${moves.length} moves`);
  let sorted = moves.sort((a, b) => a.score < b.score ? 1 : -1);

  const best = sorted[0]
  sorted
    .slice(0, 1)
    .forEach((best, index) => {
      console.log("\n============================================\n");
      console.log(JSON.stringify(best))
      displayGrid(board.hGrid, best);
    })
} else {
  console.log("No moves found");
}

function displayGrid(grid: number[][], move: any): void {
  grid.forEach((line, y) => {
    let lineOutput = '';
    let index = 0;
    let start = false;
    line.forEach((num, x) => {
      if (move.row === y && move.col === x) {
        start = true;
      }
      if (start === true && index < move.word.length) {
        if (grid[y][x] !== -1) {
          lineOutput += ' ' + move.word.charAt(index) + ' ';
        } else {
          lineOutput += ' \x1b[32m' + move.word.charAt(index) + '\x1b[0m ';
        }
        index++;
        return;
      }

      let tileOutput = ' ' + (num === -1 ? '.' : board.localeData.upperAlphabet[num]) + ' ';
      lineOutput += tileOutput;
    });
    console.log(lineOutput);
  });
}
