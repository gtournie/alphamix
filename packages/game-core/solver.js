import { Board } from './src/core/game/Board.ts';
import { BOARD_EMPTY_SQUARE } from './src/core/game/const.ts';


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
  "  FADEE       u", // 9
  "    E SALEE    ", // 10
  "T ZOU  HIT     ", // 11
  "I E R          ", // 12
  "POKES          ", // 13
  "E              ", // 14
].map(line => line.split('').map(l => (l === ' ' ? BOARD_EMPTY_SQUARE : l)));


const board = new Board(grid);
console.time('toto')
let winners = board.solve('PTBYE??');
// const winners = board.solve('PTBYEIO');
console.timeEnd('toto')
// winners = winners.filter(a => a.y == 11)
console.log(winners.length, "solutions found.");


if (winners.length) {
  let sorted = winners.sort((a, b) => a.score < b.score ? 1 : -1);
  // let sorted = winners.sort((a, b) => a.y < b.y ? (a.word < b.word ? -1 : 1) : 1);
  // let sorted = winners.sort((a, b) => {
  //   if (a.y === b.y) {
  //     return a.word < b.word ? -1 : 1;
  //   }
  //   return a.y < b.y ? -1 : 1;
  // });
  // let sorted = winners;

  const best = sorted[0]
  sorted
    // .filter(s => s.score === best.score)
    .slice(0, 1)
    // .reverse()
    .forEach((best, index) => {
      // if (index >= 0) {
      console.log("\n============================================\n");
      console.log("Word:\x1b[33m", best.word, "\x1b[0mScore:\x1b[33m", best.score + '\x1b[0m')//, best);
      board.displayGrid(board.hGrid, best)
      // } else {
      // console.log(best)
      // console.log(best.y, best.word)
      // }
    })
}

