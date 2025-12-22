import db from '../../data/1mot.json' with { type: "json" }

// /!\ WARNING: Only work for A-Z word. Case sensitive!
const A_CODE = 'A'.charCodeAt(0);
function sortAsciiString(str) {
  let count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0, len = str.length; i < len; ++i) {
    ++count[str.charCodeAt(i) - A_CODE];
  }
  let output = [];
  for (let i = 0; i < 26; ++i) {
    for (let j = count[i]; j !== 0; --j) {
      output.push(i + A_CODE);
    }
  }
  return String.fromCharCode(...output);
}

function quickSort(arr, leftPos, rightPos, arrLength) {
  let initialLeftPos = leftPos;
  let initialRightPos = rightPos;
  let pivot = rightPos;
  for (let direction = true; leftPos - rightPos < 0;) {
    if (direction === true) {
      if (arr[pivot] < arr[leftPos]) {
        let tmp = arr[pivot];
        arr[pivot] = arr[leftPos];
        arr[leftPos] = tmp;

        pivot = leftPos;
        --rightPos;
        direction = false;
      } else
        ++leftPos;
    } else {
      if (arr[pivot] <= arr[rightPos]) {
        --rightPos;
      } else {
        let tmp = arr[pivot];
        arr[pivot] = arr[rightPos];
        arr[rightPos] = tmp;

        ++leftPos;
        pivot = rightPos;
        direction = true;
      }
    }
  }
  if (pivot - 1 > initialLeftPos) {
    quickSort(arr, initialLeftPos, pivot - 1, arrLength);
  }
  if (pivot + 1 < initialRightPos) {
    quickSort(arr, pivot + 1, initialRightPos, arrLength);
  }
}

function createCheckFn(arr) {
  return new Function('word', 'return ' + arr.reduce((acc, charCode, index) => {
    if (charCode !== null) {
      acc.push('word[' + index + '] === ' + charCode);
    }
    return acc;
  }, []).join(' && ') || 'true');
}

console.time('t0')
const DB = new Map();
const WORDS_BY_SORTED_LETTERS = new Map();

const dbKeys = Object.keys(db);
for (let i = dbKeys.length - 1; i >= 0; --i) {
  let key = dbKeys[i];
  let word = key.toUpperCase();
  DB.set(word, db[key]);

  key = sortAsciiString(word);
  if (WORDS_BY_SORTED_LETTERS.has(key)) {
    WORDS_BY_SORTED_LETTERS.get(key).push(word)
  } else {
    WORDS_BY_SORTED_LETTERS.set(key, [word]);
  }
}
console.timeEnd('t0')


// /!\ This is very specific to this game needs.
// Don't use elsewhere or replace the line by the comment
function combinations(str, n, index) {
  if (str.length < n || --n < 0) return [];
  if (typeof index === 'undefined') index = 0;

  let result = [];
  for (let len = str.length; index !== len - n; ++index) {
    const value = str.charCodeAt(index);
    if (n <= 0) {
      result.push([value]);
    } else {
      const c = combinations(str, n, index); // let c = combinations(str, n, index + 1);
      for (let i = 0, l = c.length; i < l; ++i) {
        c[i].push(value);
        result.push(c[i]);
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


function combinationsByLength(arr) {
  const len = arr.length
  const amount = 1 << len;
  const output = [];
  const keys = new Set();

  function add(letters, blanks) {
    let sortedLetters = String.fromCharCode(...letters);
    if (!keys.has(sortedLetters)) {
      keys.add(sortedLetters);

      output[letters.length].incomplete.push({ letters, str: sortedLetters, blanks });
      if (WORDS_BY_SORTED_LETTERS.has(sortedLetters)) {
        output[letters.length].strict.push({ letters, str: sortedLetters, blanks });
      }
    }
  }

  for (let i = 0; i <= len; ++i) output.push({ strict: [], incomplete: [] });

  for (let i = 1; i < amount; ++i) {
    let rest = [];
    let blankIndices = [];
    for (let j = 0; j < len; ++j) {
      if ((1 << j) & i) {
        if (arr[j] === '?'.charCodeAt(0)) blankIndices.push(rest.length);
        rest.push(arr[j]);
      }
    }

    if (blankIndices.length !== 0) {
      let comb = ALPHA_COMBINATIONS[blankIndices.length];
      for (let k = comb.length - 1; k >= 0; --k) {
        let blankValues = comb[k];
        let restWithBlank = rest.slice(0);
        for (let l = blankIndices.length - 1; l >= 0; --l) {
          restWithBlank[blankIndices[l]] = blankValues[l];
        }
        add(restWithBlank.sort(), blankValues);
      }
    } else {
      add(rest.sort(), []);
    }
  }
  return output;
}

class Grid {
  static EMPTY_CASE = '.'.charCodeAt(0);
  static counter = 0;

  constructor(grid) {
    this.grid = this.enrich(grid);
    // this.invertedGrid = this.createGrid((x, y) => this.grid[y][x]);

    // this.horizontalInfo = this.getInfo(this.grid);
    // this.verticalInfo = this.getHorizontalInfo(this.invertedGrid);
    // this.displayGrid(grid);
    // this.displayGrid(this.invertedGrid);
  }

  displayGrid(grid) {
    grid.forEach((line, y) => {
      process.stdout.write(line.map(n => String.fromCharCode(n)).join('  '))
      // line.forEach((letter, x) => process.stdout.write(' ' + String.fromCharCode(letter) + ' '));
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

  // walkThroughEmptyCases(callback) {
  //   for (let y = 0; y < 15; ++y) {
  //     for (let x = 0; x < 15; ++x) {
  //       const c = this.grid[y][x];
  //       if (c !== '.') callback(x, y, value);
  //     }
  //   }
  // }

  solve(letters) {
    const arrLetters = letters.split('').map(c => c.charCodeAt(0));
    const allCombinations = combinationsByLength(arrLetters);

    this.findHorizontalSpots(({ tileCount, x, y, pattern, extraLetters }) => {
      const hValid = extraLetters.length === 0;
      const combinations = allCombinations[tileCount];
      const combi = hValid ? combinations.strict : combinations.incomplete;

      for (let k = combi.length - 1; k >= 0; --k) {
        let c = combi[k];
        let str = c.str;
        if (hValid === false) {
          c.letters.push(...extraLetters);
          quickSort(c.letters, 0, c.letters.length - 1, c.letters.length);
          str = String.fromCharCode(...c.letters);
        }
        const words = WORDS_BY_SORTED_LETTERS.get(str) || [];
        for (let l = words.length - 1; l >= 0; --l) {
          const word = words[l];

          if ((hValid === true || pattern.test(word)) && this.checkWord(word, x, y)) {
            //console.log({ x, y, word: String.fromCharCode(...word) });
          }
        }
      }
    });

    // for (let i = 1; i <= 7; ++i) {
    //   const combinations = allCombinations[i];
    //   const spots = allSpots[i];

    //   for (let j = spots.length - 1; j >= 0; --j) {
    //     const spot = spots[j];
    //     const { x, y, pattern, extraLetters } = spot;
    //     const hValid = extraLetters.length === 0;
    //     const combi = hValid ? combinations.strict : combinations.incomplete;

    //     for (let k = combi.length - 1; k >= 0; --k) {
    //       let c = combi[k];
    //       let str = c.str;
    //       if (hValid === false) {
    //         c.letters.push(...extraLetters);
    //         str = String.fromCharCode(...c.letters.sort());
    //       }
    //       const words = WORDS_BY_SORTED_LETTERS[str] || [];
    //       for (let l = words.length - 1; l >= 0; --l) {
    //         const word = words[l];

    //         if ((hValid === true || pattern(word)) && this.checkWord(word, x, y)) {
    //           // console.log({ x, y, word: String.fromCharCode(...word) });
    //         }
    //       }
    //     }
    //   }
    // }

    // console.log(combinations[7].length)
    // combinations[7].forEach(({ letters, blanks }) => {
    //   console.log({ letters: String.fromCharCode(...letters), blanks: String.fromCharCode(...blanks) });
    // })

  }

  checkWord(word, x, y) {
    for (let index = word.length - 1; index >= 0; --index) {
      const tileInfo = this.grid[y][x + index];
      if (tileInfo.value === Grid.EMPTY_CASE &&
        tileInfo.validWordWith[word[index] - A_CODE] === false) return false;
    }
    return true;
  }

  // function isValid(grid, prefixesAndSuffixes, y, x, word) {
  //   for (let index = word.length - 1; index >= 0; --index) {
  //     const currentX = x + index;
  //     if (grid[y][currentX] === '.' && prefixesAndSuffixes[y][currentX].validWordStartingWith[word.charAt(index)] === false) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  enrich(grid) {
    // Init info grid
    let enrichedGrid = this.createGrid((y, x) => ({
      value: grid[y][x],
      top: [],
      right: [],
      bottom: [],
      left: [],
      hasTopOrBottom: false,
      validWordWith: new Array(26).fill(false)
    }));

    // Left and right
    for (let y = 0; y < 15; ++y) {
      let leftX = 0;
      for (let x = 0; x < 15; ++x) {
        if (grid[y][x] !== Grid.EMPTY_CASE) continue

        let currentX = x;
        for (; x < 14 && grid[y][x + 1] !== Grid.EMPTY_CASE; ++x);

        const hInfo = enrichedGrid[y][currentX];
        hInfo.left = grid[y].slice(leftX, currentX);
        hInfo.right = grid[y].slice(currentX + 1, x + 1);

        leftX = currentX + 1;
      }
    }
    // Top and bottom
    for (let x = 0; x < 15; ++x) {
      let topY = 0;
      for (let y = 0; y < 15; ++y) {
        if (grid[y][x] !== Grid.EMPTY_CASE) continue

        let currentY = y;
        for (; y < 14 && grid[y + 1][x] !== Grid.EMPTY_CASE; ++y);

        const vInfo = enrichedGrid[currentY][x];
        vInfo.top = [];
        for (let i = topY; i < currentY; ++i) vInfo.top.push(grid[i][x]);
        vInfo.bottom = [];
        for (let i = currentY + 1; i <= y; ++i) vInfo.bottom.push(grid[i][x]);
        vInfo.hasTopOrBottom = vInfo.top.length > 0 || vInfo.bottom.length > 0;

        let valid = false;
        for (let i = 0; i < 26; ++i) {
          if (vInfo.top.length + vInfo.bottom.length === 0) {
            vInfo.validWordWith[i] = true;
          } else {
            vInfo.validWordWith[i] = DB.has((String.fromCharCode(...vInfo.top, i + A_CODE, ...vInfo.bottom)));
          }
          if (valid === false) valid = vInfo.validWordWith[i];
        }
        vInfo.valid = valid;

        topY = currentY + 1;
      }
    }
    return enrichedGrid;
  }

  findHorizontalSpots(callback) {
    // 7 letters, so we check spots from 1 to 7 letters
    // const allSpots = [null, [], [], [], [], [], [], []];

    for (let y = 0; y < 15; ++y) {
      for (let x = 0; x < 15; ++x) {
        const tile = this.grid[y][x];
        if (tile.value !== Grid.EMPTY_CASE) continue

        let currentX = x;

        let pattern = tile.left.slice(0);
        let extraLetters = tile.left.slice(0);
        // Valid if the tile before is not empty
        let validSpot = pattern.length !== 0;

        // Iterate over the next tiles. Try to spot up to 7 empty tiles
        for (let spotCount = 0; spotCount !== 7; ++currentX) {
          if (currentX > 14) break;

          // Build pattern
          const nextTile = this.grid[y][currentX];
          if (nextTile.valid === false) break;

          if (nextTile.value !== Grid.EMPTY_CASE) {
            extraLetters.push(nextTile.value);
            pattern.push(nextTile.value);
            continue;
          }

          ++spotCount;
          currentX += nextTile.right.length;
          pattern.push(null, ...nextTile.right); // Empty tile => null. And then add right tiles
          extraLetters.push(...nextTile.right);

          // Valid if the tile up or bottom the position is not empty or if the tile after is not empty
          if (!validSpot) validSpot = nextTile.hasTopOrBottom || nextTile.right.length !== 0;

          // Valid spot => build pattern and store all these info
          if (validSpot) {
            callback({
              tileCount: spotCount,
              pattern: new RegExp('^' + pattern + '$'),
              extraLetters: extraLetters.slice(0),
              x,
              y
            });
          }
        }
      }
    }
  }

  // findHorizontalSpots() {
  //   // 7 letters, so we check spots from 1 to 7 letters
  //   const allSpots = [null, [], [], [], [], [], [], []];
  //   for (let y = 0; y < 15; ++y) {
  //     let lettersBefore = '';
  //     for (let x = 0; x < 15; ++x) {
  //       const c = this.grid[y][x];
  //       if (c === '.') {
  //         let pattern = lettersBefore;
  //         lettersBefore = '';
  //         let currentX = x;
  //         // Valid if the tile before is not empty
  //         let validSpot = x !== 0 && this.grid[y][x - 1] !== '.';

  //         // Iterate over the next tiles. Try to spot up to 7 empty tiles
  //         for (let spotCount = 0, value; spotCount !== 7; ++currentX) {
  //           if (currentX > 14) break;
  //           value = this.grid[y][currentX];
  //           pattern += value;

  //           if (value === '.') {
  //             ++spotCount;

  //             // Valid if the tile up or bottom the position is not empty
  //             if (!validSpot) validSpot = (y > 0 && this.grid[y - 1][currentX] !== ".") || (y < 14 && this.grid[y + 1][currentX] !== ".");
  //             // Valid if the tile after is not empty
  //             if (!validSpot) validSpot = currentX < 14 && this.grid[y][currentX + 1] !== ".";

  //             // Valid spot => build pattern and store all these info
  //             let spotPattern = pattern;
  //             if (validSpot) {
  //               for (let patternX = currentX; patternX < 14; ++patternX) {
  //                 const val = this.grid[y][patternX + 1];
  //                 if (val === '.') break;
  //                 spotPattern += val;
  //               }
  //               allSpots[spotCount].push({ pattern: spotPattern, x, y });
  //             }
  //           } else {
  //             validSpot = true;
  //           }
  //         }
  //       } else {
  //         lettersBefore += c;
  //       }
  //     }
  //   }
  //   return allSpots;
  // }
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
].map(line => line.split('').map(l => (l === ' ' ? '.' : l).charCodeAt(0)));

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
newGrid.solve('PTBYE??')
console.timeEnd('solve')

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
