import fs from 'fs';
import { Board } from './solver.js';
import LocaleData from './LocaleData.js';

const data = fs.readFileSync('gaddag-dictionary3.bin');
const gaddagData = new Uint32Array(
  data.buffer,
  data.byteOffset,
  data.length / Uint32Array.BYTES_PER_ELEMENT
);

const alphabetLen = gaddagData[0];
const ALPHABET = new Array(alphabetLen);
for (let i = 0; i < alphabetLen; i++) {
  ALPHABET[i] = String.fromCharCode(gaddagData[i + 1]);
}

const ALPHABET_CODE_TO_CHAR_ID = new Array(65536);
ALPHABET.forEach((c, index) => { ALPHABET_CODE_TO_CHAR_ID[c.charCodeAt(0)] = index; });

const toCharId = (c: string) => c === '?' ? -2 : ALPHABET_CODE_TO_CHAR_ID[c.charCodeAt(0)] ?? -1;

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

const localeData = new LocaleData('fr', gaddagData);
const board = new Board(localeData, grid, 'PTBYE??'.split('').map(toCharId))
console.time('solve');
// const moves = new Board(gaddagData, grid, [...'PTBYEIO'].map(toCharId)).solve();
const moves = [...board.solve().values()];
console.timeEnd('solve');

if (moves.length) {
  console.log(`Found ${moves.length} moves`);
  let sorted = moves.sort((a, b) => a.score < b.score ? 1 : -1);

  // sort by y then by word
  // let sorted = moves.sort((a, b) => {
  //   if (a.row === b.row) {
  //     return a.word < b.word ? -1 : 1;
  //   }
  //   return a.row < b.row ? -1 : 1;
  // });
  const best = sorted[0]
  sorted
    // .filter(s => s.score === best.score)
    .slice(0, 1)
    // .reverse()
    .forEach((best, index) => {
      console.log("\n============================================\n");
      // if (index >= 0) {
      //   console.log("Word:\x1b[33m", best.word, "\x1b[0mScore:\x1b[33m", best.score + '\x1b[0m')//, best);
      //   board.displayGrid(board.hGrid, best)
      // } else {
      console.log(JSON.stringify(best))
      displayGrid(board.hGrid, best);
      // console.log(best.pos[0].y, best.word)
      // }
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

      let tileOutput = ' ' + (num === -1 ? '.' : board.localeData.alphabet[num]) + ' ';
      lineOutput += tileOutput;
    });
    console.log(lineOutput);
  });
}