import { Board } from './src/core/game/Board.ts';
import { BOARD_EMPTY_SQUARE } from './src/core/game/const.ts';


const grid = [
  // 123456789012345
  "               ",
  "               ",
  "               ",
  "            M  ",
  "            O  ",
  "          P Y  ",
  "          U E  ",
  "       TRUCKS  ",
  "    J     I    ",
  "   FEUTRINE    ",
  "    T     Z    ",
  "    O          ",
  "    N          ",
  "               ",
  "               ",
].map(line => line.split('').map(l => (l === ' ' ? BOARD_EMPTY_SQUARE : l)));


const board = new Board(grid);
console.time('toto')
const winners = board.solve('IAMSRXS');
console.timeEnd('toto')

if (winners.length) {
  let sorted = winners.sort((a, b) => a.score < b.score ? 1 : -1);
  const best = sorted[0]
  sorted
    // .filter(s => s.score === best.score)
    .slice(0, 3)
    // .reverse()
    .forEach((best, index) => {
      if (index >= 0) {
        console.log("Word:\x1b[33m", best.word, "\x1b[0mScore:\x1b[33m", best.score + '\x1b[0m')//, best);
        board.displayGrid(board.hGrid, best)
      } else {
        console.log(best)
      }
    })
}