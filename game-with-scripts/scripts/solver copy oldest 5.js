import db from '../data/1mot.json' with { type: "json" }

const WORDS = Object.keys(db).map(w => w.toUpperCase())
const WORDS_BY_SIZE = {}
const WORDS_WITH_SORTED_LETTERS_BY_SIZE = {}

WORDS.forEach((word) => {
  let size = word.length;
  if (!(size in WORDS_BY_SIZE)) {
    WORDS_BY_SIZE[size] = [];
    WORDS_WITH_SORTED_LETTERS_BY_SIZE[size] = [];
  }
  WORDS_BY_SIZE[size].push(word)
  WORDS_WITH_SORTED_LETTERS_BY_SIZE[size].push(word.split('').sort().join(''))
})


// Bonuses
const __ = { wordFactor: 1, letterFactor: 1, txt: "" };
const W3 = { wordFactor: 3, letterFactor: 1, txt: "MT" };
const W2 = { wordFactor: 2, letterFactor: 1, txt: "MD" };
const L3 = { wordFactor: 1, letterFactor: 3, txt: "LT" };
const L2 = { wordFactor: 1, letterFactor: 2, txt: "LD" };

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

const grid = [
  //0    1    2    3    4    5    6    7    8    9    10   11   12   13   14 
  [".", ".", ".", ".", ".", ".", ".", "S", ".", ".", ".", ".", ".", ".", "."], // 0
  [".", ".", ".", ".", ".", ".", ".", "L", ".", ".", ".", ".", ".", ".", "."], // 1
  [".", ".", ".", ".", ".", ".", ".", "E", ".", ".", ".", ".", ".", ".", "."], // 2
  [".", ".", ".", ".", ".", ".", ".", "U", ".", ".", ".", ".", ".", ".", "."], // 3
  [".", ".", ".", ".", ".", ".", ".", "T", ".", ".", ".", ".", ".", ".", "."], // 4
  [".", ".", ".", ".", ".", ".", ".", "E", ".", ".", ".", ".", ".", ".", "."], // 5
  [".", ".", ".", ".", ".", ".", "J", "E", ".", ".", ".", ".", ".", ".", "."], // 6
  [".", ".", ".", "F", "A", "D", "O", "S", ".", ".", ".", ".", ".", ".", "."], // 7
  [".", ".", ".", ".", ".", ".", "U", ".", ".", ".", ".", ".", ".", ".", "."], // 8
  [".", ".", ".", ".", ".", ".", "E", ".", ".", ".", ".", ".", ".", ".", "."], // 9
  [".", ".", ".", ".", ".", "A", "S", ".", ".", ".", ".", ".", ".", ".", "."], // 10
  [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 11
  [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 12
  [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 13
  [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 14
];

'RETINAS'

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

function combinationsBySize(str) {
  const len = str.length
  const amount = 1 << len;
  const combinations = [];
  for (let i = 0; i < len; ++i) combinations.push([]);
  for (let i = 1; i < amount; ++i) {
    let rest = '';
    for (let j = 0; j < len; ++j) {
      if ((1 << j) & i) rest += str.charAt(j);
    }
    combinations[rest.length].push(rest);
  }
  return combinations;
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

function calcWordScore(grid, y, x, word) {
  let score = 0;
  let wordFactor = 1;
  for (let index = 0, len = word.length; index < len; ++index) {
    let c = word.charAt(index);
    let bonus = grid[y][x + index] === '.' ? BONUS_GRID[y][x + index] : __;
    score += letterScore[c] * bonus.letterFactor;
    wordFactor *= bonus.wordFactor;
  }
  return score * wordFactor;
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
    // TODO: remove toLowerCase! or rewrite db with cap letters
    if (otherWord.toLowerCase() in db) {
      total += score * bonus.wordFactor;
      continue;
    }
    return -1;
  }
  return total;
}

function solve(grid, letters, invert) {
  if (invert) grid = invertGrid(grid);

  const winners = [];
  const length = letters.length;
  for (let y = 0; y < 15; ++y) {
    loopx:
    for (let x = 0; x < 15; ++x) {
      // We need to start from an empty spot
      if (grid[y][x] !== '.') continue;

      let px = x;
      let pos = [];
      let pattern = '';
      let c;
      let wordX = px;
      // Get prev tiles and build pattern
      while (--wordX >= 0) {
        c = grid[y][wordX];
        if (c === '.') break;
        pattern = c + pattern;
      }
      ++wordX;
      // Try to find "length" empty spots
      do {
        c = grid[y][px];
        if (c === ".") {
          // Empty spot
          pos.push(px);
        }
        pattern += c;
        ++px;
        if (px > 14) {
          break loopx;
        }
      } while (pos.length !== length);

      // Get next tiles and build pattern
      let currentX = px;
      while (++currentX <= 14) {
        c = grid[y][currentX];
        if (c === '.') break;
        pattern += c;
      }

      // OK, we can try combinations now
      let validSpot = pattern.length > length;
      //  || (pattern.length === length &&
      //     ((y > 1 && pos.some(px => grid[y - 1][px]) !== ".") || (y < 15 && pos.some(px => grid[y + 1][px] !== "."))));

      if (!validSpot && pattern.length === length) {
        validSpot = pos.some(px => {
          return (y > 1 && grid[y - 1][px] !== ".") || (y < 14 && grid[y + 1][px] !== ".");
        })
      }
      if (validSpot) {
        const reg = new RegExp('^' + pattern + '$')
        const words = WORDS_BY_SIZE[pattern.length];
        const wordsWithSortedLetters = WORDS_WITH_SORTED_LETTERS_BY_SIZE[pattern.length];

        const sortedPalette = (letters + pattern.replace(/\./g, '')).split('').sort().join('')
        for (let index = 0, len = words.length, word; index < len; ++index) {
          word = words[index];
          if (wordsWithSortedLetters[index] === sortedPalette && reg.test(word)) {
            let additionalScore = calcOtherWordsAroundScore(grid, y, wordX, word)
            if (additionalScore >= 0) {
              let score = calcWordScore(grid, y, wordX, word) + additionalScore;
              if (invert) {
                winners.push({ y: wordX, x: y, dir: 'ttb', word, score });
              } else {
                winners.push({ y, x: wordX, dir: 'ltr', word, score });
              }
            }
            // console.log([y, pos, word, score, additionalScore]);
          }
        }
      }
    }
  }
  return winners
}

let winners = solve(grid, 'RETINAS', false)

if (winners.length) {
  console.log("BEST: ", JSON.stringify(winners.sort((a, b) => a.score < b.score ? 1 : -1)[0]));
  // console.log(y + " " + winners.length + " winners", winners.join(', '));
}

winners = solve(grid, 'RETINAS', true)

if (winners.length) {
  console.log("BEST: ", JSON.stringify(winners.sort((a, b) => a.score < b.score ? 1 : -1)[0]));
  // console.log(y + " " + winners.length + " winners", winners.join(', '));
}

console.timeEnd('t1')