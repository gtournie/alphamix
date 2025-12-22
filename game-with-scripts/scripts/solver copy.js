import db from '../data/1mot.json' with { type: "json" }

console.time('t0')
const DB = {};
const WORDS_BY_SORTED_LETTERS = {}

const dbKeys = Object.keys(db);
for (let i = dbKeys.length - 1; i >= 0; --i) {
  let key = dbKeys[i];
  let word = key.toUpperCase();
  let len = word.length;
  DB[word] = db[key];
  key = sortAsciiString(word);
  if (!(key in WORDS_BY_SORTED_LETTERS)) {
    WORDS_BY_SORTED_LETTERS[key] = [word];
  } else {
    WORDS_BY_SORTED_LETTERS[key].push(word)
  }
}
console.timeEnd('t0')


// Bonuses
const __ = { wordFactor: 1, letterFactor: 1, txt: "" };
const W3 = { wordFactor: 3, letterFactor: 1, txt: "MT" };
const W2 = { wordFactor: 2, letterFactor: 1, txt: "MD" };
const L3 = { wordFactor: 1, letterFactor: 3, txt: "LT" };
const L2 = { wordFactor: 1, letterFactor: 2, txt: "LD" };
const SEVEN_LETTERS_BONUS = 50;

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

const LETTER_SCORE = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 10, L: 1, M: 2, N: 1, O: 1, P: 3, Q: 8, R: 1, S: 1, T: 1, U: 1, V: 4, W: 10, X: 10, Y: 10, Z: 10
}


// const grid = [
//   //0    1    2    3    4    5    6    7    8    9    10   11   12   13   14 
//   "       B       ",
//   "     KIL       ",
//   "    RALEZ      ",
//   "       U       ",
//   "       TWIN C  ",
//   "       E FANE  ",
//   "      JE    T  ",
//   "   FADOS VIVOTA",
//   "   O  U     G  ",
//   "   I  E A  DE  ",
//   "   NAYS T  ON  ",
//   "   S    A  LE  ",
//   "        XERES  ",
//   "    RODAIT     ",
//   "MINCI OHE      ",
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

function permutations(permutation) {
  var length = permutation.length,
    result = [permutation.slice()],
    c = new Array(length).fill(0),
    i = 1, k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}


// /!\ This is very specific to this game needs.
// Don't use elsewhere or replace the line by the comment
function combinations(str, n, index) {
  if (str.length < n || --n < 0) return [];
  if (typeof index === 'undefined') index = 0;

  let result = [];
  for (let len = str.length; index !== len - n; ++index) {
    if (n <= 0) {
      result.push(str.charAt(index));
    } else {
      let value = str.charAt(index);
      let c = combinations(str, n, index); // let c = combinations(str, n, index + 1);
      for (let i = 0, l = c.length; i < l; ++i) {
        result.push(value + c[i]);
      }
    }
  }
  return result;
};

// 2 blank tiles max
const ALPHA_COMBINATIONS = {
  1: combinations('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1),
  2: combinations('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 2),
};

function combinationsByLength(str) {
  const len = str.length
  const amount = 1 << len;
  const output = [];
  const keys = {};

  for (let i = 0; i <= len; ++i) output.push([]);
  for (let i = 1; i < amount; ++i) {
    let rest = '';
    for (let j = 0; j < len; ++j) {
      if ((1 << j) & i) rest += str.charAt(j);
    }

    let blankCount = rest.split('?').length - 1;
    if (blankCount > 0) {
      let comb = ALPHA_COMBINATIONS[blankCount];
      for (let k = comb.length - 1; k >= 0; --k) {
        let restWithBlank = rest;
        let letters = comb[k];
        let blanks = [];
        for (let l = 0, c; l < blankCount; ++l) {
          c = letters.charAt(l);
          blanks.push(c);
          restWithBlank = restWithBlank.replace('?', c);
        }
        let sortedLetters = sortAsciiString(restWithBlank);
        if (!(sortedLetters in keys)) {
          keys[sortedLetters] = 1;
          output[restWithBlank.length].push({ letters: sortedLetters, blanks });
        }
      }
    } else {
      let sortedLetters = sortAsciiString(rest);
      if (!(sortedLetters in keys)) {
        keys[sortedLetters] = 1;
        output[rest.length].push({ letters: sortedLetters, blanks: [] });
      }
    }
  }
  return output;
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


function storeVerticalPrefixesAndSuffixes(grid) {
  let newGrid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(_ => {
    let arr = [];
    for (let i = 0; i < 15; ++i) arr.push({ prefix: '', suffix: '', score: 0, validWordStartingWith: {} });
    return arr;
  });
  for (let x = 0; x < 15; ++x) {
    let lettersBefore = '';
    let scoreBefore = 0;
    for (let y = 0; y < 15; ++y) {
      const char = grid[y][x];
      if (char !== '.') {
        lettersBefore += char;
        scoreBefore += LETTER_SCORE[char] || 0;
      } else {
        let lettersAfter = '';
        let scoreAfter = 0;
        for (let currentY = y; currentY < 14; ++currentY) {
          const c = grid[currentY + 1][x];
          if (c === '.') break;
          lettersAfter += c;
          scoreAfter += LETTER_SCORE[c] || 0;
        }
        const prefix = lettersBefore.toUpperCase();
        const suffix = lettersAfter.toUpperCase();
        const validWordStartingWith = {};
        for (let i = 0; i < 26; ++i) {
          const letter = String.fromCharCode(i + 'A'.charCodeAt(0))
          const word = prefix + letter + suffix;
          validWordStartingWith[letter] = word.length === 1 ? true : (word in DB);
        }
        newGrid[y][x] = { prefix, suffix, validWordStartingWith, score: scoreBefore + scoreAfter };
        y += lettersAfter.length;
        lettersBefore = lettersAfter.slice(0);
        scoreBefore = scoreAfter;
      }
    }
  }
  return newGrid;
}

function isValid(grid, prefixesAndSuffixes, y, x, word) {
  for (let index = word.length - 1; index >= 0; --index) {
    const currentX = x + index;
    if (grid[y][currentX] === '.' && prefixesAndSuffixes[y][currentX].validWordStartingWith[word.charAt(index)] === false) {
      return false;
    }
  }
  return true;
}

function calcScore(grid, prefixesAndSuffixes, y, x, word, letterCnt, blanks) {
  let verticalScore = 0;
  let horizontalScore = 0;
  let horizontalWordFactor = 1;
  for (let index = 0, len = word.length; index < len; ++index) {
    let currentC = word.charAt(index);
    let bonus;
    let currentX = x + index;

    if (grid[y][currentX] !== '.') {
      // Letter was already there, so no need to calc vertical score
      bonus = __;
    } else {
      bonus = BONUS_GRID[y][currentX];
      let score = prefixesAndSuffixes[y][currentX].score;
      if (score !== 0) {
        // Calc score
        verticalScore += (score + LETTER_SCORE[currentC] * bonus.letterFactor) * bonus.wordFactor;
      }
    }

    // Calc horizontal score
    horizontalScore += LETTER_SCORE[currentC] * bonus.letterFactor;
    horizontalWordFactor *= bonus.wordFactor;
  }
  horizontalScore *= horizontalWordFactor;
  if (7 === letterCnt) horizontalScore += SEVEN_LETTERS_BONUS;
  return verticalScore + horizontalScore;
}

let count = 0;

class Game {

  constructor(grid) {
    this.grid = grid;
    this.firstTurn = false;
  }

  get invertedGrid() {
    const inverted = this.grid.map(row => row.slice());
    for (let y = 0, x; y < 15; ++y) {
      for (x = 0; x < 15; ++x) {
        inverted[y][x] = this.grid[x][y];
      }
    }
    return inverted;
  }

  solve(letters) {
    const results = [];
    const combinationsByLen = combinationsByLength(letters);

    // Should we also invert BONUS_GRID ?
    const invertedGrid = this.invertedGrid;
    const verticalPrefixesAndSuffixes = storeVerticalPrefixesAndSuffixes(this.grid);
    const horizontalPrefixesAndSuffixes = storeVerticalPrefixesAndSuffixes(invertedGrid);

    this.solveHorizontally(results, this.grid, verticalPrefixesAndSuffixes, horizontalPrefixesAndSuffixes, combinationsByLen, false);
    if (!this.firstTurn) {
      this.solveHorizontally(results, invertedGrid, horizontalPrefixesAndSuffixes, verticalPrefixesAndSuffixes, combinationsByLen, true);
    }
    return results;
  }

  solveHorizontally(winners, grid, verticalPrefixesAndSuffixes, horizontalPrefixesAndSuffixes, combinationsByLen, inverted) {
    for (let letterCnt = 1; letterCnt < combinationsByLen.length; ++letterCnt) {
      for (let y = 0; y < 15; ++y) {
        // let lettersBefore = '';
        loopx:
        for (let x = 0; x < 15; ++x) {
          if (this.firstTurn && y !== 7) continue;

          // We need to start from an empty spot
          if (grid[y][x] !== '.') {
            // lettersBefore += grid[y][x];
            continue;
          }
          let hps = horizontalPrefixesAndSuffixes[x][y]
          let otherLetters = hps.prefix;
          let pattern = otherLetters;
          // lettersBefore = '';

          let px;
          let pos = [];
          let c;
          let wordX = x - pattern.length;
          // let len = 0;
          // let validSpot = false;

          // Try to find empty spots
          for (px = x; pos.length !== letterCnt; ++px) {
            if (px > 14) break loopx;
            c = grid[y][px];
            if (c === ".") {
              // ++len;
              pos.push(px); // Empty spot

              // if (!validSpot && letterCnt > 1) {
              //   validSpot = this.firstTurn ? px === 7 : prefixesAndSuffixes[y][px].validSpot;
              // }
            } else {
              otherLetters += c;
            }
            pattern += c;
          }

          hps = horizontalPrefixesAndSuffixes[px - 1][y]
          pattern += hps.suffix;
          otherLetters += hps.suffix;

          // Get next tiles and build pattern
          // for (let currentX = px - 1; currentX < 14; ++currentX) {
          //   c = grid[y][currentX + 1];
          //   if (c === '.') break;
          //   pattern += c;
          //   otherLetters += c;
          // }

          // OK, we can try combinations now
          // if (!validSpot && pattern.length > letterCnt) validSpot = true
          let validSpot = pattern.length > letterCnt;

          if (!validSpot && letterCnt > 1 && pattern.length === letterCnt) {
            if (this.firstTurn) {
              validSpot = pos.includes(7) // Center
            } else {
              // Check spots around
              for (let i = pos.length - 1, px; i >= 0; --i) {
                px = pos[i];
                if ((y > 0 && grid[y - 1][px] !== ".") || (y < 14 && grid[y + 1][px] !== ".")) {
                  validSpot = true;
                  break;
                }
              }
            }
          }

          if (validSpot) {
            const reg = new RegExp('^' + pattern + '$')
            const combinations = combinationsByLen[letterCnt]

            for (let i = combinations.length - 1; i >= 0; --i) {
              const { letters, blanks } = combinations[i];

              const sortedPalette = otherLetters !== '' ? sortAsciiString(letters + otherLetters) : letters;
              const words = WORDS_BY_SORTED_LETTERS[sortedPalette] || [];

              for (let index = words.length - 1, word; index >= 0; --index) {
                word = words[index];
                if ((otherLetters === '' || reg.test(word)) && isValid(grid, verticalPrefixesAndSuffixes, y, wordX, word)) {
                  let score = calcScore(grid, verticalPrefixesAndSuffixes, y, wordX, word, letterCnt, blanks);
                  if (inverted) {
                    winners.push({ y: wordX, x: y, dir: 'ttb', word, score });
                  } else {
                    winners.push({ y, x: wordX, dir: 'ltr', word, score, letterCnt });
                  }
                }
                // console.log([y, pos, word, score, additionalScore]);
              }
            }
          }
        }
      }
    }
    return winners
  }
}

function solve(grid, letters) {
  const winners = []
  const combinationsByLen = combinationsByLength(letters)
  const firstTurn = false; // TODO
  solveHorizontally(winners, grid, firstTurn, combinationsByLen, false);
  if (!firstTurn) solveHorizontally(winners, invertGrid(grid), firstTurn, combinationsByLen, true);
  return winners
}

console.time('t1')
// let winners = solve(grid, combinationsByLength('RETINAS'), false)
// let winners = solve(grid, 'PTBYE??')
let winners = new Game(grid).solve('PTBYE??')
// let winners = new Game(grid).solve('URMTNUE')
// let winners = new Game(grid).solve('UAITEAU')
console.timeEnd('t1')


if (winners.length) {
  let sorted = winners.sort((a, b) => {
    return a.score < b.score ? 1 : -1
  })
  const best = sorted[0]
  sorted
    .filter(s => s.score === best.score)
    .slice(0, 1)
    .forEach(best => {
      console.log("Word:\x1b[33m", best.word, "\x1b[0mScore:\x1b[33m", best.score + '\x1b[0m')//, best);
      if (best) displayGrid(grid, best)
    })
  // console.log(count)
}


// let arr = storeVerticalPrefixesAndSuffixes(grid)
// for (let i = 0; i < arr.length; ++i) {
//   console.log(JSON.stringify(arr[i]));
// }

// console.time('t2')
// console.log(Object.keys(DB).length)
// console.timeEnd('t2')

// winners = solve(grid, combinationsByLength('RETINAS'), true)

// if (winners.length) {
//   console.log("BEST: ", JSON.stringify(winners.sort((a, b) => a.score < b.score ? 1 : -1)[0]));
//   // console.log(y + " " + winners.length + " winners", winners.join(', '));
// }

