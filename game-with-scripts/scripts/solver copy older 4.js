import db from '../data/1mot.json' with { type: "json" }

console.time('t0')
const DB = {};
const WORDS = []
const WORDS_BY_SIZE = {}
const WORDS_WITH_SORTED_LETTERS_BY_SIZE = {}

Object.keys(db).forEach((k) => {
  let word = k.toUpperCase();
  DB[word] = db[k];
  WORDS.push(word);

  let size = word.length;
  if (!(size in WORDS_BY_SIZE)) {
    WORDS_BY_SIZE[size] = [];
    WORDS_WITH_SORTED_LETTERS_BY_SIZE[size] = [];
  }
  WORDS_BY_SIZE[size].push(word)
  WORDS_WITH_SORTED_LETTERS_BY_SIZE[size].push(sortAsciiString(word))

})
console.timeEnd('t0')


// Bonuses
const __ = { wordFactor: 1, letterFactor: 1, txt: "" };
const W3 = { wordFactor: 3, letterFactor: 1, txt: "MT" };
const W2 = { wordFactor: 2, letterFactor: 1, txt: "MD" };
const L3 = { wordFactor: 1, letterFactor: 3, txt: "LT" };
const L2 = { wordFactor: 1, letterFactor: 2, txt: "LD" };
const SEVEN_LETTERS = 50;

const BONUS_GRID = [
  //0   1   2   3   4   5   6   7   8   9  10  11  12  13  14 
  [W3, __, __, L2, __, __, __, W3, __, __, __, L2, __, __, W3], // 0
  [__, W2, __, __, __, L3, __, __, __, L3, __, __, __, W2, __], // 1
  [__, __, W2, __, __, __, L2, __, L2, __, __, __, W2, __, __], // 2
  [L2, __, __, W2, __, __, __, L2, __, __, __, W2, __, __, L2], // 3
  [__, __, __, __, W2, __, __, __, __, __, W2, __, __, __, __], // 4
  [__, L3, __, __, __, L3, __, __, __, L3, __, __, __, L3, __], // 5
  [__, __, L2, __, __, __, L2, __, L2, __, __, __, L2, __, __], // 6
  [W3, __, __, L2, __, __, __, W2, __, __, __, L2, __, __, W3], // 7
  [__, __, L2, __, __, __, L2, __, L2, __, __, __, L2, __, __], // 8
  [__, L3, __, __, __, L3, __, __, __, L3, __, __, __, L3, __], // 9
  [__, __, __, __, W2, __, __, __, __, __, W2, __, __, __, __], // 10
  [L2, __, __, W2, __, __, __, L2, __, __, __, W2, __, __, L2], // 11
  [__, __, W2, __, __, __, L2, __, L2, __, __, __, W2, __, __], // 12
  [__, W2, __, __, __, L3, __, __, __, L3, __, __, __, W2, __], // 13
  [W3, __, __, L2, __, __, __, W3, __, __, __, L2, __, __, W3], // 14
];

const letterScore = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 10, L: 1, M: 2, N: 1, O: 1, P: 3, Q: 8, R: 1, S: 1, T: 1, U: 1, V: 4, W: 10, X: 10, Y: 10, Z: 10
}


// const grid = [
//   //0    1    2    3    4    5    6    7    8    9    10   11   12   13   14 
//   "       B       ",
//   "     KIL       ",
//   "    RALEZ      ",
//   "       U       ",
//   "       TWIN    ",
//   "       E       ",
//   "      JE       ",
//   "   FADOS       ",
//   "   O  U        ",
//   "   I  E        ",
//   "   NAYS        ",
//   "   S           ",
//   "               ",
//   "               ",
//   "               ",
// ].map(line => line.split('').map(l => l === ' ' ? '.' : l));

const grid = [
  //0    1    2    3    4    5    6    7    8    9    10   11   12   13   14 
  "               ",
  "           T V ",
  "          JOUES",
  "           N L ",
  "          AN A ",
  "       MOFLE TA",
  "    G     O   X",
  "   BADER  I   A",
  "    R WURMS   I",
  "  FADEE        ",
  "    E SALEE    ",
  "T ZOU  HIT     ",
  "I E R          ",
  "POKES          ",
  "E              ",
].map(line => line.split('').map(l => l === ' ' ? '.' : l));

// displayGrid(grid)

function displayGrid(grid, winner) {
  if (!winner) winner = { word: '', x: -1, y: -1, dir: '' };

  const { word, dir, x, y } = winner;
  const ltr = dir === 'ltr';
  const wordPos = [];
  for (let index = 0, len = word.length; index < len; ++index) {
    let c = word.charAt(index);
    if (ltr) {
      if (grid[y][x + index] === '.') wordPos.push({ y, x: x + index, letter: c })
    } else {
      if (grid[y + index][x] === '.') wordPos.push({ y: y + index, x, letter: c })
    }
  }

  grid.forEach((line, y) => {
    line.forEach((letter, x) => {
      const win = wordPos.find(p => p.x === x && p.y === y);
      if (win) {
        process.stdout.write(' \x1b[32m' + win.letter + '\x1b[0m ');
      } else {
        process.stdout.write(' ' + letter + ' ');
      }
    })
    process.stdout.write("\n");
  })
}

// EMPTY
// const grid = [
//   //0    1    2    3    4    5    6    7    8    9    10   11   12   13   14 
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 0
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 1
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 2
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 3
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 4
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 5
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 6
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 7
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 8
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 9
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 10
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 11
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 12
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 13
//   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 14
// ];

// function combinations(str) {
//   const combinations = [];
//   const len = str.length
//   const amount = 1 << len;
//   for (let i = 1; i < amount; ++i) {
//     let rest = '';
//     for (let j = 0; j < len; ++j) {
//       if ((1 << j) & i) rest += str.charAt(j);
//     }
//     combinations.push(rest);
//   }
//   return combinations;
// }

// /!\ WARNING: Only work for A-Z word. Case sensitive!
function sortAsciiString(str) {
  let count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let output = '';
  for (let i = 0, len = str.length; i < len; ++i) {
    ++count[str.charCodeAt(i) - 65];
  }
  for (let i = 0; i < 26; ++i) {
    for (let j = count[i]; j !== 0; --j) {
      output += String.fromCharCode(i + 65);
    }
  }
  return output;
}

function combinationsByLength(str) {
  const len = str.length
  const amount = 1 << len;
  const combinations = [];
  for (let i = 0; i <= len; ++i) combinations.push(new Set());
  for (let i = 1; i < amount; ++i) {
    let rest = '';
    for (let j = 0; j < len; ++j) {
      if ((1 << j) & i) rest += str.charAt(j);
    }
    combinations[rest.length].add(sortAsciiString(rest));
  }
  return combinations.map(c => Array.from(c));
}

function invertGrid(grid) {
  const newGrid = grid.map(row => row.slice());
  for (let y = 0, x; y < 15; ++y) {
    for (x = 0; x < 15; ++x) {
      newGrid[y][x] = grid[x][y];
    }
  }
  return newGrid;
}

const letters = 'RETINA';

console.time('t1')

function calcWordScore(grid, y, x, word, letterCnt) {
  let score = 0;
  let wordFactor = 1;
  for (let index = 0, len = word.length; index < len; ++index) {
    let c = word.charAt(index);
    let bonus = grid[y][x + index] === '.' ? BONUS_GRID[y][x + index] : __;
    score += letterScore[c] * bonus.letterFactor;
    wordFactor *= bonus.wordFactor;
  }
  score *= wordFactor;
  return 7 === letterCnt ? score + SEVEN_LETTERS : score;
}

function calcOtherWordsAroundScore(grid, y, x, word) {
  let total = 0;
  for (let index = 0, len = word.length; index < len; ++index) {
    let currentX = x + index;
    if (grid[y][currentX] !== '.') continue;

    let score = 0;
    let otherWord = '';
    let bonus = BONUS_GRID[y][currentX];
    let c;

    // Prev tiles
    let currentY = y;
    while (--currentY >= 0) {
      c = grid[currentY][currentX];
      if (c === '.') break;
      otherWord = c + otherWord;
      score += letterScore[c];
    }

    otherWord += word.charAt(index);
    score += letterScore[word.charAt(index)] * bonus.letterFactor;

    // Next tiles
    currentY = y;
    while (++currentY <= 14) {
      c = grid[currentY][currentX];
      if (c === '.') break;
      otherWord += c;
      score += letterScore[c];
    }

    // Valid word?
    if (otherWord.length === 1) {
      continue;
    }
    if (otherWord in DB) {
      total += score * bonus.wordFactor;
      continue;
    }
    return -1;
  }
  return total;
}


// TODO: pass winners as param
function solveHorizontally(winners, grid, firstTurn, combinationsByLen, inverted) {
  for (let letterCnt = 1; letterCnt < combinationsByLen.length; ++letterCnt) {
    for (let y = 0; y < 15; ++y) {
      let lettersBefore = '';
      loopx:
      for (let x = 0; x < 15; ++x) {
        if (firstTurn && y !== 7) continue;

        // We need to start from an empty spot
        if (grid[y][x] !== '.') {
          lettersBefore += grid[y][x];
          continue;
        }
        let pattern = lettersBefore;
        lettersBefore = '';

        let px = x;
        let pos = [];
        let c;
        let wordX = x - lettersBefore.length;

        // Get prev tiles and build pattern
        // for(wordX = px; wordX > 0; --wordX) {
        //   c = grid[y][wordX - 1];
        //   if (c === '.') break;
        //   pattern = c + pattern;
        // }

        // Try to find empty spots
        do {
          c = grid[y][px];
          if (c === ".") {
            // Empty spot
            pos.push(px);
          }
          pattern += c;
          ++px;
          if (px > 14) {
            lettersBefore = '';
            break loopx;
          }
        } while (pos.length !== letterCnt);
        --px;

        // Get next tiles and build pattern
        for(let currentX = px; currentX < 14; ++currentX) {
          c = grid[y][currentX + 1];
          if (c === '.') break;
          pattern += c;
        }

        // OK, we can try combinations now
        let validSpot = pattern.length > letterCnt;

        if (!validSpot && letterCnt > 1 && pattern.length === letterCnt) {
          if (firstTurn) {
            validSpot = pos.includes(7) // Center
          } else {
            // Check spots around
            for (let i = pos.length - 1, px; i >= 0; --i) {
              px = pos[i];
              if ((y > 1 && grid[y - 1][px] !== ".") || (y < 14 && grid[y + 1][px] !== ".")) {
                validSpot = true;
                break;
              }
            }
          }
        }
        
        if (validSpot) {
          const reg = new RegExp('^' + pattern + '$')
          const words = WORDS_BY_SIZE[pattern.length];
          const wordsWithSortedLetters = WORDS_WITH_SORTED_LETTERS_BY_SIZE[pattern.length];
          pattern = pattern.replace(/\./g, '');

          const combinations = combinationsByLen[letterCnt]
          for (let i = combinations.length - 1; i >= 0; --i) {
            const letters = combinations[i];
            const sortedPalette = pattern !== '' ? sortAsciiString(letters + pattern) : letters;

            for (let index = words.length - 1, word; index >= 0; --index) {
              word = words[index];

              if (wordsWithSortedLetters[index] === sortedPalette && reg.test(word)) {
                let additionalScore = calcOtherWordsAroundScore(grid, y, wordX, word);
                if (additionalScore >= 0) {
                  let score = calcWordScore(grid, y, wordX, word, letterCnt) + additionalScore;
                  if (inverted) {
                    winners.push({ y: wordX, x: y, dir: 'ttb', word, score });
                  } else {
                    winners.push({ y, x: wordX, dir: 'ltr', word, score, letterCnt, letters });
                  }
                }
                // console.log([y, pos, word, score, additionalScore]);
              }
            }
          }
        }
      }
    }
  }
  return winners
}

function solve(grid, letters) {
  const winners = []
  const combinationsByLen = combinationsByLength(letters)
  const firstTurn = false; // TODO
  solveHorizontally(winners, grid, firstTurn, combinationsByLen, false);
  if (!firstTurn) solveHorizontally(winners, invertGrid(grid), firstTurn, combinationsByLen, true);
  return winners
}

// let winners = solve(grid, combinationsByLength('RETINAS'), false)
let winners = solve(grid, 'PTBYEEI')
console.timeEnd('t1')

if (winners.length) {
  let sorted = winners.sort((a, b) => {
    return a.score < b.score ? 1 : -1
   })
  const best = sorted[0]
  sorted
    .filter(s => s.score === best.score)
    // .slice(0, 4)
    .forEach(best => {
      console.log("Word:\x1b[33m", best.word, "\x1b[0mScore:\x1b[33m", best.score + '\x1b[0m')//, best);
      if (best) displayGrid(grid, best)
    })
  
  // console.log(y + " " + winners.length + " winners", winners.join(', '));
}

// winners = solve(grid, combinationsByLength('RETINAS'), true)

// if (winners.length) {
//   console.log("BEST: ", JSON.stringify(winners.sort((a, b) => a.score < b.score ? 1 : -1)[0]));
//   // console.log(y + " " + winners.length + " winners", winners.join(', '));
// }

