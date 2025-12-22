import db from '../../data/1mot.json' with { type: "json" }
import fs from 'fs';

function sortAsciiString(str, str2 = '') {
  const sortedCodes = [];
  for (let i = 0, len = str2.length; i < len; ++i) {
    sortedCodes.push(str2.charCodeAt(i));
  }
  for (let i = str.length - 1, j; i >= 0; --i) {
    let currentCode = str.charCodeAt(i);
    for (j = sortedCodes.length - 1; j >= 0 && sortedCodes[j] > currentCode; --j) {
      sortedCodes[j + 1] = sortedCodes[j];
    }
    sortedCodes[j + 1] = currentCode;
  }
  return String.fromCharCode(...sortedCodes);
}

// Function to calculate the bit mask of a word
function calculateBitMask(word) {
  let mask = 0;
  for (let i = word.length - 1; i >= 0; --i)
    mask |= (1 << (word.charCodeAt(i) - 65)); // 65 = 'A'.charCodeAt(0)
  return mask;
}

class MapArray extends Map {
  set(key, value) {
    if (super.has(key)) {
      return super.get(key).push(value);
    }
    return super.set(key, [value]);
  }
}


console.time('t0')
const DB = new Map();
const WORDS_BITMASKS = new Map()
const WORDS_BY_LENGTH = new MapArray();
const SUBSET_OF = new MapArray();
const WORDS_BY_SORTED_LETTERS = new MapArray();

let dbKeys = Object.keys(db).sort((a, b) => a.length - b.length);
for (let i = dbKeys.length - 1; i >= 0; --i) {
  let key = dbKeys[i];
  let word = key.toUpperCase();
  DB.set(word, db[key]);
  WORDS_BITMASKS.set(word, calculateBitMask(word));
  WORDS_BY_LENGTH.set(word.length, word);

  key = sortAsciiString(word);
  WORDS_BY_SORTED_LETTERS.set(key, word);

  // if (WORDS_BY_SORTED_LETTERS.has(key)) {
  //   WORDS_BY_SORTED_LETTERS.get(key).push(word)
  // } else {
  //   WORDS_BY_SORTED_LETTERS.set(key, [word]);
  // }
}
console.timeEnd('t0')

console.time('t1')

const lengths = Array.from(WORDS_BY_LENGTH.keys()).sort((a, b) => a - b);
let words = lengths.slice(0, -1).flatMap(length => WORDS_BY_LENGTH.get(length));
let currentLength = lengths.shift();
let shortWordsCache = lengths.flatMap(length => WORDS_BY_LENGTH.get(length));

let n = 0;
process.stdout.write('' + currentLength)
for (let j = 0, len = words.length; j < len; ++j) {
  const word = words[j];
  const wordBitmask = WORDS_BITMASKS.get(word);

  if (word.length > currentLength) {
    lengths.shift();
    shortWordsCache = lengths.flatMap(length => WORDS_BY_LENGTH.get(length));
    currentLength = word.length;
    process.stdout.write(' ' + currentLength + ':' + WORDS_BY_LENGTH.get(currentLength).length * shortWordsCache.length)
  }

  // Start searching from longer words
  for (const otherWord of shortWordsCache) {
    if ((wordBitmask & WORDS_BITMASKS.get(otherWord)) === wordBitmask && otherWord.indexOf(word) !== -1) {
      SUBSET_OF.set(word, otherWord);
      ++n;
    }
  }
}

const WORDS_INFOS = new Map();
for (let [word, subset] of SUBSET_OF) {
  let maxCharBefore = 0;
  let maxCharAfter = 0;
  for (let i = subset.length - 1; i >= 0; --i) {
    let s = subset[i];
    let index = s.indexOf(word);
    maxCharBefore = Math.max(maxCharBefore, index);
    maxCharAfter = Math.max(maxCharAfter, s.length - (index + word.length));
  }
  WORDS_INFOS.set(word, {
    asPrefixOnly: maxCharBefore === 0, 
    asSuffixOnly: maxCharAfter === 0,
    maxCharBefore,
    maxCharAfter,
  })
}
console.timeEnd('t1')

fs.writeFileSync('words-infos.json', JSON.stringify(Object.fromEntries(WORDS_INFOS), null, 2))

console.log('\nn:', n)
console.log(DB.has('CORNEZ'), DB.has('ENCORNEZ'), SUBSET_OF.get('CORNEZ'))

process.exit(0)


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


class Grid {
  static A_CODE = 'A'.charCodeAt(0);
  static EMPTY_TILE = '.'; // one char only
  static EMPTY_TILE_CODE = this.EMPTY_TILE.charCodeAt(0);
  static LETTER_SCORE = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 10, L: 1, M: 2,
    N: 1, O: 1, P: 3, Q: 8, R: 1, S: 1, T: 1, U: 1, V: 4, W: 10, X: 10, Y: 10, Z: 10
  };
  static SEVEN_LETTERS_BONUS = 50;
  static BONUSES = {
    BLANK: { wordCoeff: 1, letterCoeff: 0, txt: "" },
    __: { wordCoeff: 1, letterCoeff: 1, txt: "" },
    W3: { wordCoeff: 3, letterCoeff: 1, txt: "MT" },
    W2: { wordCoeff: 2, letterCoeff: 1, txt: "MD" },
    L3: { wordCoeff: 1, letterCoeff: 3, txt: "LT" },
    L2: { wordCoeff: 1, letterCoeff: 2, txt: "LD" }
  };
  static BONUS_GRID = (function ({ __, W3, W2, L3, L2 }) {
    return [
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
  })(this.BONUSES);
  static INVERTED_BONUS_GRID = this.prototype.invertGrid(this.BONUS_GRID);

  // 2 blank tiles max
  static ALPHA_COMBINATIONS = {
    1: combinations('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1),
    2: combinations('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 2),
  };
  static REPLACE_BLANK_REG = /\?/g;

  static counter = 0;

  constructor(grid) {
    this.grid = this.enrich(grid, this.constructor.BONUS_GRID);
    this.invertedGrid = this.enrich(this.invertGrid(grid), this.constructor.INVERTED_BONUS_GRID);
  }

  invertGrid(grid) {
    return this.createGrid((y, x) => grid[x][y])
  }

  displayGrid(grid, winner) {
    if (!winner) winner = { word: '', x: -1, y: -1, dir: '' };

    const { word, dir, x, y } = winner;
    const ltr = dir === 'ltr';
    const wordPos = [];
    for (let index = 0, len = word.length; index < len; ++index) {
      let c = word.charAt(index);
      if (ltr) {
        if (grid[y][x + index].empty) wordPos.push({ y, x: x + index, letter: c })
      } else {
        if (grid[y + index][x].empty) wordPos.push({ y: y + index, x, letter: c })
      }
    }

    grid.forEach((line, y) => {
      line.forEach((tile, x) => {
        const win = wordPos.find(p => p.x === x && p.y === y);
        if (win) {
          process.stdout.write(' \x1b[32m' + win.letter + '\x1b[0m ');
        } else {
          process.stdout.write(' ' + (tile.isBlank ? tile.value.toLowerCase() : tile.value) + ' ');
        }
      });
      process.stdout.write("\n");
    })
  }

  createGrid(callback) {
    const newGrid = [];
    for (let y = 0; y < 15; ++y) {
      newGrid[y] = [];
      for (let x = 0; x < 15; ++x) {
        newGrid[y].push(callback(y, x));
      }
    }
    return newGrid
  }

  newTile(value, bonus) {
    const empty = value === this.constructor.EMPTY_TILE;
    const isBlank = empty === false && value === value.toLowerCase();
    if (empty === false) {
      bonus = this.constructor.BONUSES.__;
    }
    if (isBlank) {
      value = value.toUpperCase();
      bonus = this.constructor.BONUSES.BLANK;
    }
    return {
      empty,
      bonus,
      isBlank,
      value: value,
      valid: false,
      top: '',
      right: '',
      bottom: '',
      left: '',
      validWordWith: 0, // Instead of new Set()
      verticalScore: 0
    };
  }

  enrich(grid, bonusGrid) {
    // Init info grid
    let enrichedGrid = this.createGrid((y, x) => {
      return this.newTile(grid[y][x], bonusGrid[y][x])
    });

    // Left and right
    for (let y = 0; y < 15; ++y) {
      let leftX = 0;
      for (let x = 0; x < 15; ++x) {
        if (enrichedGrid[y][x].empty === false) continue

        let currentX = x;
        for (; x < 14 && enrichedGrid[y][x + 1].empty === false; ++x);

        const hInfo = enrichedGrid[y][currentX];
        hInfo.left = grid[y].slice(leftX, currentX).join('').toUpperCase();
        hInfo.right = grid[y].slice(currentX + 1, x + 1).join('').toUpperCase();

        leftX = currentX + 1;
      }
    }
    // Top and bottom
    for (let x = 0; x < 15; ++x) {
      let topY = 0;
      for (let y = 0; y < 15; ++y) {
        if (enrichedGrid[y][x].empty === false) continue

        let currentY = y;
        for (; y < 14 && enrichedGrid[y + 1][x].empty === false; ++y);

        const vInfo = enrichedGrid[currentY][x];
        vInfo.verticalScore = 0;
        vInfo.top = '';
        for (let i = topY; i < currentY; ++i) {
          vInfo.top += grid[i][x];
          vInfo.verticalScore += Grid.LETTER_SCORE[grid[i][x]] || 0;
        }
        vInfo.top = vInfo.top.toUpperCase();

        vInfo.bottom = '';
        for (let i = currentY + 1; i <= y; ++i) {
          vInfo.bottom += grid[i][x];
          vInfo.verticalScore += Grid.LETTER_SCORE[grid[i][x]] || 0;
        }
        vInfo.bottom = vInfo.bottom.toUpperCase();

        vInfo.valid = false;
        for (let i = 0; i < 26; ++i) {
          if (vInfo.top.length + vInfo.bottom.length === 0 || DB.has(vInfo.top + String.fromCharCode(i + Grid.A_CODE) + vInfo.bottom)) {
            vInfo.validWordWith |= (1 << i); // Instead of vInfo.validWordWith.add(i + A_CODE);
            vInfo.valid = true;
          }
        }
        topY = currentY + 1;
      }
    }
    return enrichedGrid;
  }

  combinationsByLength(str) {
    const len = str.length
    const amount = 1 << len;
    const output = [];
    const keys = new Set();

    function add(letters, blanks) {
      const sortedLetters = sortAsciiString(letters);
      if (!keys.has(sortedLetters)) {
        keys.add(sortedLetters);

        output[letters.length].incomplete.push([sortedLetters, blanks]);
        if (WORDS_BY_SORTED_LETTERS.has(sortedLetters)) {
          output[letters.length].strict.push([sortedLetters, blanks]);
        }
      }
    }

    for (let i = 0; i <= len; ++i) output.push({ strict: [], incomplete: [] });
    for (let i = 1; i < amount; ++i) {
      let rest = '';
      const blanks = [];
      for (let j = 0; j < len; ++j) {
        if ((1 << j) & i) {
          const c = str.charAt(j);
          if (c === '?') blanks.push(c);
          rest += c;
        }
      }
      if (blanks.length !== 0) {
        let comb = this.constructor.ALPHA_COMBINATIONS[blanks.length];
        for (let k = comb.length - 1; k >= 0; --k) {
          const blankValues = comb[k];
          let index = 0;
          add(rest.replace(Grid.REPLACE_BLANK_REG, () => blankValues.charAt(index++)), blankValues);
        }
      } else {
        add(rest, []);
      }
    }
    return output;
  }

  solve(letters, firstTurn = false) {
    const results = [];
    const maxSpotCount = Math.min(letters.length, 7);
    const allCombinations = this.combinationsByLength(letters);
    this.solveHorizontal(results, allCombinations, maxSpotCount, firstTurn, false);
    this.solveHorizontal(results, allCombinations, maxSpotCount, firstTurn, true);
    return results;
  }

  solveHorizontal(results, allCombinations, maxSpotCount, firstTurn, inverted) {
    const grid = inverted ? this.invertedGrid : this.grid;
    for (let y = 0; y < 15; ++y) {
      for (let x = 0; x < 15; ++x) {
        const tile = grid[y][x];
        if (tile.valid === false) continue

        let currentX = x;

        // let pattern = tile.left;
        let patternLetters = [];
        let extraLetters = tile.left;
        // Valid if the tile before is not empty
        let validSpot = extraLetters.length !== 0;

        // Iterate over the next tiles. Try to spot up to 7 empty tiles
        for (let spotCount = 0; spotCount !== maxSpotCount; ++currentX) {
          if (currentX > 14) break;

          // Build pattern
          const nextTile = grid[y][currentX];
          if (nextTile.empty === true && nextTile.valid === false) break;

          // pattern += nextTile.value;

          // if (y === 7 && x === 0) {
          //   console.log('patternLetters:', patternLetters, spotCount, nextTile.empty, nextTile.value, nextTile.valid, currentX)
          // }

          if (nextTile.empty === false) {
            extraLetters += nextTile.value;
            patternLetters.push([tile.left.length + currentX - x, nextTile.value.charCodeAt(0)]); // position, char
            continue;
          }

          ++spotCount;
          // currentX += nextTile.right.length;
          // pattern += nextTile.right;
          // extraLetters += nextTile.right;

          // Valid if the tile up or bottom the position is not empty or if the tile after is not empty
          if (!validSpot) {
            if (firstTurn) {
              validSpot = y === 7 && currentX === 7;
            } else {
              validSpot = nextTile.top.length !== 0 || nextTile.bottom.length !== 0 || nextTile.right.length !== 0;
            }
          }

          // Valid spot => build pattern and store all these info
          if (validSpot && tile.left.length + spotCount + extraLetters.length + nextTile.right.length > 1) {
            this.matchingWordsPerSpot(results, grid, x, y,
              allCombinations[spotCount], spotCount, inverted,
              tile, nextTile,
              patternLetters,
              extraLetters + nextTile.right
            );
          }
        }
      }
    }
  }

  checkHorizontalWord(word, start, end, letters) {
    if (end.length !== 0 && word.endsWith(end) === false) return false;
    if (start.length !== 0 && word.startsWith(start) === false) return false;
    for (let i = letters.length - 1; i >= 0; --i) {
      const cp = letters[i];
      if (word.charCodeAt(cp[0]) !== cp[1]) return false;
    }
    return true;
  }

  checkVerticalWords(grid, word, x, y, start, end) {
    for (let index = word.length - end - 1; index >= start; --index) {
      const tile = grid[y][x + index];
      if (tile.empty === true &&
        !(tile.validWordWith & (1 << (word.charCodeAt(index) - Grid.A_CODE))) // instead of tile.validWordWith.has(word.charCodeAt(index)) === false
      ) {
        return false;
      }
    }
    return true;
  }

  calcScore(grid, word, x, y, letterCnt) {
    let verticalScore = 0;
    let horizontalScore = 0;
    let horizontalWordCoeff = 1;
    for (let index = word.length - 1; index >= 0; --index) {
      const currentC = word.charAt(index);
      const tile = grid[y][x + index];
      const tileScore = tile.bonus.letterCoeff * (Grid.LETTER_SCORE[currentC] || 0);
      horizontalScore += tileScore;
      horizontalWordCoeff *= tile.bonus.wordCoeff;
      if (tile.top.length !== 0 || tile.bottom.length !== 0) {
        verticalScore += (tile.verticalScore + tileScore) * tile.bonus.wordCoeff;
      }
    }
    horizontalScore *= horizontalWordCoeff;
    if (7 === letterCnt) horizontalScore += Grid.SEVEN_LETTERS_BONUS;
    return verticalScore + horizontalScore;
  }

  calcBestScore(grid, word, x, y, letterCnt, blanks) {
    let best;
    for (let i = blanks.length - 1; i >= 0; --i) {
      const char = blanks[i];
      best = { score: 0, pos: -1 };
      for (let pos = word.length - 1; pos >= 0; --pos) {
        if (grid[y][x + pos].empty && word.charAt(pos) === char) {
          const replacement = word.slice(0, pos) + char.toLowerCase() + word.slice(pos + 1);
          const score = this.calcScore(grid, replacement, x, y, letterCnt);
          if (score > best.score) best = { score, pos };
        }
      }
      if (best.pos !== -1) {
        word = word.slice(0, best.pos) + char.toLowerCase() + word.slice(best.pos + 1);
      }
    }
    return { score: best.score, word };
  }

  matchingWordsPerSpot(results, grid, x, y, combinations, spotCount, inverted, tile, nextTile, patternLetters, extraLetters) {
    const hValid = extraLetters.length === 0;
    const combi = hValid === true ? combinations.strict : combinations.incomplete;
    const start = tile.left.length;
    const end = nextTile.right.length;
    const wordX = x - start;

    for (let k = combi.length - 1; k >= 0; --k) {
      let [str, blanks] = combi[k];
      if (hValid !== true) str = sortAsciiString(extraLetters, str);

      const words = WORDS_BY_SORTED_LETTERS.get(str);
      if (!words) continue;

      const hasBlank = blanks.length !== 0;

      for (let l = words.length - 1; l >= 0; --l) {
        let word = words[l];

        if ((hValid === true || this.checkHorizontalWord(word, tile.left, nextTile.right, patternLetters) === true)
          && this.checkVerticalWords(grid, word, wordX, y, start, end, spotCount, extraLetters)) {
          let score;
          if (hasBlank) {
            ({ score, word } = this.calcBestScore(grid, word, wordX, y, spotCount, blanks));
          } else {
            score = this.calcScore(grid, word, wordX, y, spotCount);
          }

          results.push(inverted
            ? { y: wordX, x: y, word, count: spotCount, dir: 'ttb', score }
            : { x: wordX, y, word, count: spotCount, dir: 'ltr', score }
          );
        }
      }
    }
  }
}


// const grid = [
//   // 0123456789    10   11   12   13   14 
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
// ].map(line => line.split('').map(l => (l === ' ' ? '.' : l).charCodeAt(0)));

const grid = [
  //12345678901234 
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
].map(line => line.split('').map(l => (l === ' ' ? Grid.EMPTY_TILE : l)));

// const grid = [
//   //12345678901234 
//   "            LEK", // 0
//   "           FIS ", // 1
//   "          DER  ", // 2
//   "         TUEE V", // 3
//   "         HE   E", // 4
//   "        HA B  C", // 5
//   "        AIRELLE", // 6
//   "       WUS A  S", // 7
//   "      PuY  U   ", // 8
//   "     MI N OCEAN", // 9
//   "       BERNONS ", // 10
//   "       O   U   ", // 11
//   "      QI LAPEZ ", // 12
//   "       V     U ", // 13
//   "      MEDITAiT ", // 14
// ].map(line => line.split('').map(l => (l === ' ' ? Grid.EMPTY_TILE : l)));

// new Grid(grid).findAllSpots()

console.time('grid')
let newGrid = new Grid(grid);
console.timeEnd('grid')
// newGrid.grid[14].forEach((o, x) => {
//   let obj = { x };
//   obj.left = String.fromCharCode(...o.left)
//   obj.top = String.fromCharCode(...o.top)
//   obj.right = String.fromCharCode(...o.right)
//   obj.bottom = String.fromCharCode(...o.bottom)
//   console.log(JSON.stringify(obj))
// })

console.time('solve')
const results = newGrid.solve('PTBYE??')
// const results = newGrid.solve('GENIEOD')
console.timeEnd('solve')

const winners = results.sort((a, b) => a.score < b.score ? 1 : -1) // .filter(a => a.count === 2);
// winners.forEach(w => newGrid.displayGrid(newGrid.grid, w));
const winner = winners[0];
console.log(winner)
newGrid.displayGrid(newGrid.grid, winner);


console.log(Grid.counter)

// console.time('grid')
// let obj = new Grid(grid).getHorizontalInfo()[12][4];
// console.timeEnd('grid')
// obj.left = String.fromCharCode(...obj.left);
// obj.right = String.fromCharCode(...obj.right);
// console.log(obj)


// console.time('grid creation')
// const g = new Grid(grid);
// console.timeEnd('grid creation')

// console.time('spots')
// let spots = g.findHorizontalSpots();
// console.timeEnd('spots')
// spots[3].filter(g => g.y === 0).forEach(obj => {
//   obj.pattern = String.fromCharCode(...obj.pattern)
//   console.log(obj)
// })
