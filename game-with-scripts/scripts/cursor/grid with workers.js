import db from '../../data/words.json' with { type: "json" }
import wordsBySortedLetters from '../../data/words-by-sorted-letters.json' with { type: "json" }

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


export async function getCPUCoreCount() {
  if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency;
  }
  if (typeof process !== "undefined" && process.versions?.node) {
    const os = await import("os");
    return os.cpus().length;
  }
  return 1; // Non supporté
}

// Initialize the module
(async function () {
  // Import worker_threads if in Node.js environment
  let Worker;
  if (typeof window === 'undefined') {
    const { Worker: NodeWorker } = await import('worker_threads');
    Worker = NodeWorker;
  } else {
    Worker = window.Worker;
  }

  function supportWorker() {
    return !!(Worker && Blob);
  }

  const CPU_COUNT = await getCPUCoreCount();

  const DB = new Map(Object.entries(db));
  const WORDS_BY_SORTED_LETTERS = new Map(Object.entries(wordsBySortedLetters));

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

  class WorkerPool {
    constructor(size) {
      this.size = size;
      this.workers = [];
      this.available = [];
      this._workerCode = null;
      this.queue = [];
      this.initialized = false;
    }

    createWorkerCode() {
      if (!this._workerBlob) {
        console.time('createWorkerCode');
        const workerCode = `
          // Import dependencies
          ${sortAsciiString.toString()};
          ${combinations.toString()};
          
          // Import data and recreate constants
          const DB = new Map(Object.entries(${JSON.stringify(db)}));
          const WORDS_BY_SORTED_LETTERS = new Map(Object.entries(${JSON.stringify(wordsBySortedLetters)}));
          
          // Grid class definition
          ${Grid.toString()}
          
          // Worker message handler
          self.onmessage = function(e) {
            const grid = new Grid(e.data.grid);
            const results = [];
            const maxSpotCount = Math.min(e.data.letters.length, 7);
            const allCombinations = grid.combinationsByLength(e.data.letters);
            grid.solveHorizontal(results, allCombinations, maxSpotCount, e.data.firstTurn, false, e.data.startLine, e.data.endLine);
            grid.solveHorizontal(results, allCombinations, maxSpotCount, e.data.firstTurn, true, e.data.startLine, e.data.endLine);
            self.postMessage(results);
          };
        `;
        console.timeEnd('createWorkerCode');
        const blob = new Blob([workerCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        this._workerBlob = { blob, url };
      }
      return this._workerBlob;
    }

    async createWorker() {
      const workerBlob = this.createWorkerCode();
      const worker = new Worker(workerBlob.url);
      
      // Store original terminate function
      // const originalTerminate = worker.terminate;
      
      // // Override terminate to clean up the blob URL
      // worker.terminate = () => {
      //   URL.revokeObjectURL(blob);
      //   originalTerminate.call(worker);
      // };
      
      return worker;
    }

    async initialize() {
      if (this.initialized) return;
      
      console.time('initializeWorkers');
      // Create all workers upfront
      for (let i = 0; i < this.size; i++) {
        const worker = await this.createWorker();
        this.workers.push(worker);
        this.available.push(worker);
      }
      this.initialized = true;
      console.timeEnd('initializeWorkers');
    }

    async getWorker() {
      if (!this.initialized) {
        await this.initialize();
      }

      return new Promise((resolve) => {
        if (this.available.length > 0) {
          resolve(this.available.pop());
        } else {
          this.queue.push(resolve);
        }
      });
    }

    processQueue() {
      if (this.queue.length === 0 || this.available.length === 0) return;

      const resolve = this.queue.shift();
      const worker = this.available.pop();
      resolve(worker);
    }

    releaseWorker(worker) {
      this.available.push(worker);
      this.processQueue();
    }

    terminate() {
      this.workers.forEach(worker => worker.terminate());
      if (this._workerBlob) URL.revokeObjectURL(this._workerBlob.url);
      this.workers = [];
      this.available = [];
      this.queue = [];
      this.initialized = false;
    }
  }

  // Create a global worker pool
  const workerPool = new WorkerPool(CPU_COUNT);

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
    static _workerCode = null;

    constructor(grid) {
      this.originalGrid = grid;
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
            // process.stdout.write(' \x1b[32m' + win.letter + '\x1b[0m ');
          } else {
            if (tile.invalid === false) {
              // process.stdout.write(' \x1b[31m' + tile.value + '\x1b[0m ');
            } else {
              // process.stdout.write(' ' + (tile.isBlank ? tile.value.toLowerCase() : tile.value) + ' ');
            }
          }
        });
        // process.stdout.write("\n");
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
        validDir: { top: false, bottom: false, left: false, right: false },
        top: '',
        right: '',
        bottom: '',
        left: '',
        validWordWith: 0, // Instead of new Set()
        verticalScore: 0
      };
    }

    detectInvalidDirTiles(enrichedGrid) {
      for (let y = 0; y < 15; ++y) {
        for (let x = 0; x < 15; ++x) {
          const tile = enrichedGrid[y][x];
          if (tile.empty === false) {
            for (let currentX = x - 1; x - currentX <= 7 && currentX >= 0; --currentX) {
              if (enrichedGrid[y][currentX].empty === false) break;
              enrichedGrid[y][currentX].validDir.left = true;
            }
            for (let currentX = x + 1; currentX - x <= 7 && currentX < 15; ++currentX) {
              if (enrichedGrid[y][currentX].empty === false) break;
              enrichedGrid[y][currentX].validDir.right = true;
            }
            for (let currentY = y - 1; y - currentY <= 7 && currentY >= 0; --currentY) {
              if (enrichedGrid[currentY][x].empty === false) break;
              enrichedGrid[currentY][x].validDir.top = true;
            }
            for (let currentY = y + 1; currentY - y <= 7 && currentY < 15; ++currentY) {
              if (enrichedGrid[currentY][x].empty === false) break;
              enrichedGrid[currentY][x].validDir.bottom = true;
            }
          }
        }
      }
    }

    isColEmptyAroundWord(enrichedGrid, wordX, wordY, step) {
      for (let i = wordY + step; i >= 0 && i < 15; i += step) {
        if (enrichedGrid[i][wordX].empty === false) return false;
      }
      return true;
    }

    isLineEmptyAroundWord(enrichedGrid, wordX, wordY, step) {
      for (let i = wordX + step; i >= 0 && i < 15; i += step) {
        if (enrichedGrid[wordY][i].empty === false) return false;
      }
      return true;
    }

    // wordX = x of the first word's letter
    detectInvalidHorizontalTiles(enrichedGrid, word, wordX, wordY) {
      if (word.length < 2) return;

      let info = DB.get(word);
      if (info.asPrefixOnly && wordX > 0) enrichedGrid[wordY][wordX - 1].valid = false;
      if (this.isLineEmptyAroundWord(enrichedGrid, wordX, wordY, -1)) {
        for (let i = wordX - 1 - info.maxCharBefore; i >= 0; --i) {
          enrichedGrid[wordY][i].validDir.left = false;
        }
      }
      if (info.asSuffixOnly && wordX + word.length < 15) enrichedGrid[wordY][wordX + word.length].valid = false;
      if (this.isLineEmptyAroundWord(enrichedGrid, wordX, wordY, 1)) {
        for (let i = wordX + word.length + info.maxCharAfter; i < 15; ++i) {
          enrichedGrid[wordY][i].validDir.right = false;
        }
      }
    }

    detectInvalidVerticalTiles(enrichedGrid, word, wordX, wordY) {
      if (word.length < 2) return;

      let info = DB.get(word);
      if (info.asPrefixOnly && wordY > 0) enrichedGrid[wordY - 1][wordX].valid = false;
      if (this.isColEmptyAroundWord(enrichedGrid, wordX, wordY, -1)) {
        for (let i = wordY - 1 - info.maxCharBefore; i >= 0; --i) {
          enrichedGrid[i][wordX].validDir.top = false;
        }
      }
      if (info.asSuffixOnly && wordY + word.length < 15) enrichedGrid[wordY + word.length][wordX].valid = false;
      if (this.isColEmptyAroundWord(enrichedGrid, wordX, wordY, 1)) {
        for (let i = wordY + word.length + info.maxCharAfter; i < 15; ++i) {
          enrichedGrid[i][wordX].validDir.bottom = false;
        }
      }
    }

    enrich(grid, bonusGrid) {
      // Init info grid
      let enrichedGrid = this.createGrid((y, x) => {
        return this.newTile(grid[y][x], bonusGrid[y][x])
      });

      // Detect invalid tiles (meaning they're too far from another present tile)
      // this.detectInvalidDirTiles(enrichedGrid);

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

          // this.detectInvalidHorizontalTiles(enrichedGrid, hInfo.left, currentX - hInfo.left.length, y);
          // this.detectInvalidHorizontalTiles(enrichedGrid, hInfo.right, currentX + 1, y);

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

          // this.detectInvalidVerticalTiles(enrichedGrid, vInfo.top, x, currentY - vInfo.top.length);
          // this.detectInvalidVerticalTiles(enrichedGrid, vInfo.bottom, x, currentY + 1);

          topY = currentY + 1;
        }
      }

      // Too far from all directions => invalid
      // for (let y = 0; y < 15; ++y) {
      //   for (let x = 0; x < 15; ++x) {
      //     const tile = enrichedGrid[y][x];
      //     if (tile.empty && tile.validDir.left === false && tile.validDir.right === false && tile.validDir.top === false && tile.validDir.bottom === false) {
      //       tile.valid = false;
      //     }
      //   }
      // }
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

    async solveWithWorkers(letters, firstTurn = false) {
      // If only one CPU or workers not supported, use synchronous execution
      if (CPU_COUNT <= 1 || !supportWorker()) {
        return this.solve(letters, firstTurn);
      }

      const workerCount = CPU_COUNT;
      const promises = [];
      const chunkSize = Math.ceil(15 / workerCount); // Split grid into chunks

      for (let i = 0; i < workerCount; i++) {
        const startLine = i * chunkSize;
        const endLine = Math.min(startLine + chunkSize, 15);
        
        const worker = await workerPool.getWorker();

        // Create promise for this worker
        const promise = new Promise((resolve, reject) => {
          worker.onmessage = (e) => { 
            workerPool.releaseWorker(worker);
            resolve(e.data);
          };
          worker.onerror = (e) => {
            workerPool.releaseWorker(worker);
            reject(e);
          };
        });

        const messageData = {
          grid: this.originalGrid,
          letters,
          firstTurn,
          startLine,
          endLine
        };

        worker.postMessage(messageData);
        promises.push(promise);
      }

      try {
        // Wait for all workers to complete
        const results = await Promise.all(promises);
        // Merge results from all workers
        return results.flat();
      } catch (error) {
        console.error('Worker error:', error);
        throw error;
      }
    }

    solve(letters, firstTurn = false) {
      const results = [];
      const maxSpotCount = Math.min(letters.length, 7);
      const allCombinations = this.combinationsByLength(letters);
      this.solveHorizontal(results, allCombinations, maxSpotCount, firstTurn, false);
      this.solveHorizontal(results, allCombinations, maxSpotCount, firstTurn, true);
      return results;
    }

    solveHorizontal(results, allCombinations, maxSpotCount, firstTurn, inverted, startLine = 0, endLine = 15) {
      const grid = inverted ? this.invertedGrid : this.grid;
      for (let y = startLine; y < endLine; ++y) {
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

  // Initialize worker pool after Grid class is defined
  await workerPool.initialize();

  // Clean up workers when the page is unloaded
  if (typeof window !== 'undefined') {
    window.addEventListener('unload', () => workerPool.terminate());
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
    "  FADEE        ", // 9
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

  // newGrid.displayGrid(newGrid.grid)

  // console.time('solve')
  // const results = await newGrid.solveWithWorkers('PTBYE??')
  // // const results = newGrid.solve('GENIEOD')
  // console.timeEnd('solve')
  // console.time('solve')
  // await newGrid.solveWithWorkers('PTBYE??')
  // // const results = newGrid.solve('GENIEOD')
  // console.timeEnd('solve')
  console.time('solve')
  const results = newGrid.solve('PTBYE??')
  // const results = newGrid.solve('GENIEOD')
  console.timeEnd('solve')

  const winners = results.sort((a, b) => a.score < b.score ? 1 : -1) // .filter(a => a.count === 2);
  // winners.forEach(w => newGrid.displayGrid(newGrid.grid, w));
  const winner = winners[0];
  console.log(winner)
  newGrid.displayGrid(newGrid.grid, winner);


  // console.log(Grid.counter)

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


})();