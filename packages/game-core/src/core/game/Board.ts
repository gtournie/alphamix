import { sortAsciiString, range } from './utils.js';
import type {
  GridTile,
  WordResult,
  Bonus,
  Bonuses,
  Combinations,
  PlayerTile,
  NodeGridTile,
  CheckLettersResult,
  ValidationResult,
  CheckLettersError,
  Coord,
  PlayWordResult
} from './types.js';

// Import the dictionary data
import { InvalidHistoryError } from './Exceptions.js';
import { HistoryEntry } from './HistoryEntry.js';
import { History } from './History.js';
import { BOARD_SQUARE_BONUSES, BOARD_EMPTY_SQUARE, BINGO_BONUS, TILE_SCORE, TILE_RACK_SIZE, HISTORY_DELIMITERS } from './const.js';
import DB from '../../../data/1mot';
import WORDS_BY_SORTED_LETTERS from '../../../data/words-by-sorted-letters';
import { CombinationGenerator } from './CombinationGenerator.js';


export class Board {
  static readonly BONUS_GRID = (function ({ __, W3, W2, L3, L2 }: Bonuses) {
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
  })(BOARD_SQUARE_BONUSES);

  static readonly INVERTED_BONUS_GRID = this.prototype.invertGrid(this.BONUS_GRID);

  static counter = 0;
  static _workerCode = null;

  private _originalHGrid: string[][] | undefined;
  private _originalVGrid: string[][] | undefined;
  private _hGrid: GridTile[][] | undefined;
  private _vGrid: GridTile[][] | undefined;

  constructor(originalHGrid?: string[][]) {
    this._originalHGrid = originalHGrid || Board.createGrid(() => BOARD_EMPTY_SQUARE);
    // this.originalVGrid = this.invertGrid(originalHGrid);
    // this.hGrid = this.enrich(originalHGrid, Board.BONUS_GRID);
    // this.vGrid = this.enrich(this.originalVGrid, Board.INVERTED_BONUS_GRID);
  }

  get originalHGrid() {
    if (!this._originalHGrid) {
      if (!this._originalVGrid) throw new Error('originalHGrid');
      this._originalHGrid = this.invertGrid(this._originalVGrid);
    }
    return this._originalHGrid;
  }

  get originalVGrid() {
    if (!this._originalVGrid) {
      if (!this._originalHGrid) throw new Error('originalVGrid');
      this._originalVGrid = this.invertGrid(this._originalHGrid);
    }
    return this._originalVGrid;
  }

  get hGrid() {
    if (!this._hGrid) this._hGrid = this.enrich(this.originalHGrid, Board.BONUS_GRID);
    return this._hGrid;
  }

  get vGrid() {
    if (!this._vGrid) this._vGrid = this.enrich(this.originalVGrid, Board.INVERTED_BONUS_GRID);
    return this._vGrid;
  }

  static buildFromHistory(history: string, userCount = NaN, currentUserIndex = NaN) {
    const grid: string[][] = this.createGrid(() => BOARD_EMPTY_SQUARE);
    new History(history, userCount, currentUserIndex).forEach((historyEntry) => {
      if (!historyEntry.isWordTurn) return;

      for (let index = 0, len = historyEntry.chars.length, addX = 0, addY = 0; index < len;) {
        if (historyEntry.y + addY >= 15 || historyEntry.x + addX >= 15) throw new InvalidHistoryError();

        if (grid[historyEntry.y + addY][historyEntry.x + addX] === BOARD_EMPTY_SQUARE) {
          let char = historyEntry.chars.charAt(index);
          grid[historyEntry.y + addY][historyEntry.x + addX] = char;
          ++index;
        }
        if (historyEntry.isHorizontalWordTurn) ++addX;
        if (historyEntry.isVerticalWordTurn) ++addY;
      }
    });
    return new Board(grid);
  }

  // public playWord(historyEntry: HistoryEntry) {
  //   const inverted = historyEntry.isVerticalWordTurn;
  //   let squareGrid = inverted ? this.vGrid : this.hGrid;
  //   let simpleGrid = Board.copyOriginalGrid(inverted ? this.originalVGrid : this.originalHGrid);
  //   if (inverted) [historyEntry.y, historyEntry.x] = [historyEntry.x, historyEntry.y];

  //   if (!squareGrid[historyEntry.y][historyEntry.x].isEmpty) throw new InvalidHistoryError();

  //   let mainWord = squareGrid[historyEntry.y][historyEntry.x].left;
  //   let crossWords = [];
  //   let startX = historyEntry.x - mainWord.length;
  //   let addX = 0;
  //   for (let index = 0, len = historyEntry.chars.length; index < len; ++addX) {
  //     if (historyEntry.x + addX >= 15) throw new InvalidHistoryError();

  //     if (squareGrid[historyEntry.y][historyEntry.x + addX].isEmpty) {
  //       let char = historyEntry.chars.charAt(index);
  //       simpleGrid[historyEntry.y][historyEntry.x + addX] = char;
  //       mainWord += char;
  //       const square = squareGrid[historyEntry.y][historyEntry.x + addX];
  //       if (square.top || square.bottom) crossWords.push(square.top + char + square.bottom);
  //       ++index;
  //     } else {
  //       mainWord += squareGrid[historyEntry.y][historyEntry.x + addX].value;
  //     }
  //   }
  //   // historyEntry.chars has at least 1 char, so addX - 1 is ok
  //   mainWord += squareGrid[historyEntry.y][historyEntry.x + addX - 1].right;
  //   const score = this.calcScore(squareGrid, mainWord, startX, historyEntry.y, historyEntry.chars.length);

  //   this._vGrid = this._hGrid = this._originalHGrid = this._originalVGrid = void (0);
  //   if (inverted) {
  //     this._originalVGrid = simpleGrid;
  //   } else {
  //     this._originalHGrid = simpleGrid;
  //   }

  //   return { mainWord, crossWords, score };
  // }


  // Check if all words are valid
  // Check if there is no floating words
  // Check if the central tile is filled
  public check(): ValidationResult {
    // Convert tiles into nodes connected to each other
    let nodes: NodeGridTile[][] = Board.createGrid(() => {
      return { leftNode: null, rightNode: null, topNode: null, bottomNode: null }
    });
    let countNonEmptyNodes = 0;
    let refNode;
    // Check if all words on the grid are valids
    const invalidWords: Set<string> = new Set();
    for (let y = 0; y < 15; ++y) {
      for (let x = 0; x < 15; ++x) {
        const tile = this.hGrid[y][x];
        if (tile.isEmpty === true) {
          if (tile.left.length >= 2 && !DB.has(tile.left)) invalidWords.add(tile.left);
          if (tile.right.length >= 2 && !DB.has(tile.right)) invalidWords.add(tile.right);
          if (tile.top.length >= 2 && !DB.has(tile.top)) invalidWords.add(tile.top);
          if (tile.bottom.length >= 2 && !DB.has(tile.bottom)) invalidWords.add(tile.bottom);
        } else {
          ++countNonEmptyNodes;
          const node = nodes[y][x];
          if (x > 0 && !this.hGrid[y][x - 1].isEmpty) node.leftNode = nodes[y][x - 1];
          if (x < 14 && !this.hGrid[y][x + 1].isEmpty) node.rightNode = nodes[y][x + 1];
          if (y > 0 && !this.hGrid[y - 1][x].isEmpty) node.topNode = nodes[y - 1][x];
          if (y < 14 && !this.hGrid[y + 1][x].isEmpty) node.bottomNode = nodes[y + 1][x];

          if (!refNode) refNode = node;
        }
      }
    }
    if (refNode) {
      // Ensure the center tile (7, 7) is filled 
      if (this.hGrid[7][7].isEmpty) return { valid: false, error: 'emptyCenter' };

      // We take the first non empty tile and try to count how many tiles are in the same tree
      // If this number is equal to countTiles, it means there is only one tree. 
      const tree: Set<NodeGridTile> = new Set();
      this.buildTreeFromNode(tree, refNode);
      if (tree.size !== countNonEmptyNodes) return { valid: false, error: 'notConnected' };
    }
    if (invalidWords.size > 0) {
      return { valid: false, error: 'invalidWords', invalidWords: Array.from(invalidWords) };
    }
    return { valid: true };
  }

  private buildTreeFromNode(tree: Set<NodeGridTile>, node: NodeGridTile) {
    if (tree.has(node)) return;

    tree.add(node);
    if (node.leftNode) this.buildTreeFromNode(tree, node.leftNode);
    if (node.rightNode) this.buildTreeFromNode(tree, node.rightNode);
    if (node.topNode) this.buildTreeFromNode(tree, node.topNode);
    if (node.bottomNode) this.buildTreeFromNode(tree, node.bottomNode);
  }

  public playWord(historyEntry: HistoryEntry): PlayWordResult {
    const inverted = historyEntry.isVerticalWordTurn;
    if (inverted) [historyEntry.y, historyEntry.x] = [historyEntry.x, historyEntry.y];
    let squareGrid = inverted ? this.vGrid : this.hGrid;
    const xAxis = inverted ? 'y' : 'x';
    const yAxis = inverted ? 'x' : 'y';

    if (!squareGrid[historyEntry.y][historyEntry.x].isEmpty) throw new InvalidHistoryError();

    const letters = [];
    for (let index = 0, addX = 0, len = historyEntry.chars.length; index < len; ++addX) {
      if (historyEntry.x + addX >= 15) throw new InvalidHistoryError();
      if (squareGrid[historyEntry.y][historyEntry.x + addX].isEmpty) {
        let char = historyEntry.chars.charAt(index);
        letters.push({ char, [xAxis]: historyEntry.x + addX, [yAxis]: historyEntry.y } as unknown as PlayerTile)
        ++index;
      }
    }
    const validation = this.checkLetters(letters);
    if (!validation.valid) throw new InvalidHistoryError();

    this._vGrid = this._hGrid = this._originalVGrid = void (0);
    for (let i = letters.length - 1; i >= 0; --i) {
      const letter = letters[i];
      this.originalHGrid[letter.y][letter.x] = letter.char;
    }

    return validation as PlayWordResult;
  }

  public checkLetters(letters: PlayerTile[]): CheckLettersResult {
    if (letters.length === 0) return { valid: false, errors: { noTilesGiven: true } };

    let hCheck;
    // Check horizontal
    if (letters.length === 1 || letters[0].x !== letters[letters.length - 1].x) {
      hCheck = this.checkHorizontalLetters(this.hGrid, letters, false);
      if (hCheck.valid || letters.length > 1) return hCheck;
    }

    // Check vertical
    let vCheck = this.checkHorizontalLetters(this.vGrid, letters.map(l => ({ ...l, y: l.x, x: l.y })), true);
    return letters.length > 1 || !hCheck || (vCheck.wordSpan?.word?.length || 0) > (hCheck.wordSpan?.word?.length || 0) ? vCheck : hCheck;
  }

  // This function check if the letters are placed correctly
  // It checks that on first turn letters.length > 1 and letters are placed on center tile
  // It checks if all the letters are connected to the others or already present tiles
  // It checks that they're all on the same line or column
  // It checks that the new word is a valid word
  // It checks that all the words that could be created indirectly (in the other dimension) are valid
  // It returns an object with the following properties:
  // isValid: boolean
  // error: noTilesGiven | notConnected | notAttachedToExistingWord | notSameLineOrColumn | notValidWord | notValidIndirectWord | null
  // score: number
  private checkHorizontalLetters(grid: GridTile[][], letters: PlayerTile[], inverted: boolean): CheckLettersResult {
    letters.sort((a, b) => a.x - b.x);

    const errors: Partial<Record<CheckLettersError, true>> = {};
    const firstTurn = grid[7][7].isEmpty;

    // Check if they're all on the same line or column
    let sameLine = true;
    const refLetter = letters[0];
    for (let i = letters.length - 1; i >= 0; --i) {
      if (letters[i].y !== refLetter.y) sameLine = false;
    }
    if (!sameLine) return { valid: false, errors: { notInline: true } };

    // Check if they're all connected
    const y = refLetter.y;
    const firstX = letters[0].x;
    const lastX = letters[letters.length - 1].x;
    const left = grid[y][letters[0].x].left;
    const right = grid[y][letters[letters.length - 1].x].right;

    const xAxis = inverted ? 'y' : 'x';
    const yAxis = inverted ? 'x' : 'y';
    let wordSpan = {
      valid: true,
      word: left,
      coords: range(firstX - left.length, lastX + right.length).map(v => ({ [xAxis]: v, [yAxis]: y })) as unknown as Coord[]
    };
    let crossWordSpans = [];
    let lettersIndex = 0;
    let attachedToExistingWord = false;
    // let oneInvalidCrossWord = false;
    for (let i = firstX; i <= lastX; ++i) {
      const tile = grid[y][i];
      if (tile.isEmpty === true) {
        // Check if the letter is connected
        if (letters[lettersIndex].x !== i) {
          return { valid: false, errors: { notConnected: true } };
        }
        // Check vertical word
        const char = letters[lettersIndex].char;
        if (tile.top || tile.bottom) {
          const invalid = !(tile.validWordWith & (1 << (char.toUpperCase().charCodeAt(0) - 65))); // 65 is the ASCII code of 'A'
          const crossWord = tile.top + char + tile.bottom;
          crossWordSpans.push({
            valid: !invalid,
            word: crossWord,
            coords: range(y - tile.top.length, y + tile.bottom.length).map(v => ({ [yAxis]: v, [xAxis]: i })) as unknown as Coord[]
          });
          if (invalid) errors.invalidCrossWord = true;
        }
        // Check if it's attached to an existing word
        if (!attachedToExistingWord) {
          attachedToExistingWord = tile.top.length !== 0 || tile.bottom.length !== 0 || tile.right.length !== 0 || tile.left.length !== 0;
        }
        wordSpan.word += char;
        ++lettersIndex;
      } else {
        wordSpan.word += tile.tileChar;
        attachedToExistingWord = true;
      }
    }
    if (!attachedToExistingWord) {
      if (!firstTurn) {
        errors.floating = true;
      } else if (letters[0].y !== 7 || !letters.some(l => l.x === 7)) {
        errors.invalidFirstMove = true;
      }
    }
    wordSpan.word += right;

    // Check if the word exists
    if (firstTurn && letters.length < 2) {
      errors.wordTooShort = true;
    } else if (!DB.has(wordSpan.word.toUpperCase())) {
      wordSpan.valid = false;
      errors.invalidWord = true;
    };

    // Calc score
    const wordX = firstX - left.length;
    const score = this.calcScore(grid, wordSpan.word, wordX, y, letters.length);
    const entry = (inverted ? HISTORY_DELIMITERS.VERTICAL_WORD_TURN : HISTORY_DELIMITERS.HORIZONTAL_WORD_TURN)
      + wordSpan.coords[0].y + wordSpan.coords[0].x + wordSpan.word;
    return { valid: Object.keys(errors).length === 0, errors, score, wordSpan, crossWordSpans, entry, horizontal: !inverted };
  }

  private invertGrid<T>(grid: T[][]): T[][] {
    return Board.createGrid((y, x) => grid[x][y]);
  }

  displayGrid(grid: GridTile[][], winner?: WordResult): void {
    if (!winner) winner = { word: '', x: -1, y: -1, dir: 'ltr', count: 0, score: 0 };

    const { word, dir, x, y } = winner;
    const ltr = dir === 'ltr';
    const wordPos: Array<{ x: number; y: number; letter: string }> = [];
    for (let index = 0, len = word.length; index < len; ++index) {
      let c = word.charAt(index);
      if (ltr) {
        if (grid[y][x + index].isEmpty) wordPos.push({ y, x: x + index, letter: c });
      } else {
        if (grid[y + index][x].isEmpty) wordPos.push({ y: y + index, x, letter: c });
      }
    }

    grid.forEach((line, y) => {
      let lineOutput = '';
      line.forEach((tile, x) => {
        const win = wordPos.find(p => p.x === x && p.y === y);
        if (win) {
          lineOutput += ' \x1b[32m' + win.letter + '\x1b[0m ';
        } else {

          // if (tile.valid === false) {
          //   lineOutput += ' \x1b[31m' + tile.char + '\x1b[0m ';
          // } else {
          let tileOutput = ' ' + (tile.isBlank ? tile.tileChar.toLowerCase() : tile.tileChar) + ' ';
          // if (Board.BONUS_GRID[y][x] === BOARD_SQUARE_BONUSES.W2) {
          //   tileOutput = ' \x1b[33m' + tileOutput.trim() + '\x1b[0m '; // Orange
          // }
          // if (Board.BONUS_GRID[y][x] === BOARD_SQUARE_BONUSES.W3) {
          //   tileOutput = ' \x1b[31m' + tileOutput.trim() + '\x1b[0m '; // Red
          // }
          // if (Board.BONUS_GRID[y][x] === BOARD_SQUARE_BONUSES.L2) {
          //   tileOutput = ' \x1b[36m' + tileOutput.trim() + '\x1b[0m '; // Light blue
          // }
          // if (Board.BONUS_GRID[y][x] === BOARD_SQUARE_BONUSES.L3) {
          //   tileOutput = ' \x1b[34m' + tileOutput.trim() + '\x1b[0m '; // Dark Blue
          // }
          lineOutput += tileOutput;
          // }
        }
      });
      console.log(lineOutput);
    });
  }

  static createGrid<T>(callback: (y: number, x: number) => T): T[][] {
    const newGrid: T[][] = [];
    for (let y = 0; y < 15; ++y) {
      newGrid[y] = [];
      for (let x = 0; x < 15; ++x) {
        newGrid[y].push(callback(y, x));
      }
    }
    return newGrid;
  }

  static copyOriginalGrid(grid: string[][]): string[][] {
    const newGrid: string[][] = [];
    for (let y = 0; y < 15; ++y) newGrid[y] = grid[y].slice(0);
    return newGrid;
  }

  private newTile(value: string, bonus: Bonus): GridTile {
    const isEmpty = value === BOARD_EMPTY_SQUARE;
    const isBlank = isEmpty === false && value === value.toLowerCase();
    let tileChar = value;
    if (isEmpty === false) {
      bonus = BOARD_SQUARE_BONUSES.__;
    }
    if (isBlank) {
      tileChar = value.toUpperCase();
      bonus = BOARD_SQUARE_BONUSES.BLANK;
    }
    return {
      isEmpty,
      bonus,
      isBlank,
      value,
      tileChar,
      code: tileChar.charCodeAt(0),
      valid: false,
      top: '',
      right: '',
      bottom: '',
      left: '',
      validWordWith: 0,
      verticalScore: 0
    };
  }

  private enrich(grid: string[][], bonusGrid: Bonus[][]): GridTile[][] {
    // Init info grid
    let enrichedGrid = Board.createGrid((y, x) => {
      return this.newTile(grid[y][x], bonusGrid[y][x]);
    });

    // Left and right
    for (let y = 0; y < 15; ++y) {
      let leftX = 0;
      for (let x = 0; x < 15; ++x) {
        if (enrichedGrid[y][x].isEmpty === false) continue;

        let currentX = x;
        for (; x < 14 && enrichedGrid[y][x + 1].isEmpty === false; ++x);

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
        if (enrichedGrid[y][x].isEmpty === false) continue;

        let currentY = y;
        for (; y < 14 && enrichedGrid[y + 1][x].isEmpty === false; ++y);

        const vInfo = enrichedGrid[currentY][x];
        vInfo.verticalScore = 0;
        vInfo.top = '';
        for (let i = topY; i < currentY; ++i) {
          vInfo.top += grid[i][x];
          vInfo.verticalScore += TILE_SCORE[grid[i][x]] || 0;
        }
        vInfo.top = vInfo.top.toUpperCase();

        vInfo.bottom = '';
        for (let i = currentY + 1; i <= y; ++i) {
          vInfo.bottom += grid[i][x];
          vInfo.verticalScore += TILE_SCORE[grid[i][x]] || 0;
        }
        vInfo.bottom = vInfo.bottom.toUpperCase();

        vInfo.valid = false;
        for (let i = 0; i < 26; ++i) {
          if (vInfo.top.length + vInfo.bottom.length === 0 || DB.has(vInfo.top + String.fromCharCode(i + 65) + vInfo.bottom)) { // 65 is the ASCII code of 'A'
            vInfo.validWordWith |= (1 << i);
            vInfo.valid = true;
          }
        }

        topY = currentY + 1;
      }
    }

    return enrichedGrid;
  }

  // private checkHorizontalWord(word: string, start: string, end: string, letters: Array<[number, number]>): boolean {
  //   if (end.length !== 0 && !word.endsWith(end)) return false;
  //   if (start.length !== 0 && !word.startsWith(start)) return false;

  //   for (let i = letters.length - 1; i >= 0; --i) {
  //     const [pos, charCode] = letters[i];
  //     if (word.charCodeAt(pos) !== charCode) return false;
  //   }

  //   return true;
  // }

  // private checkVerticalWords(grid: GridTile[][], word: string, x: number, y: number, start: number, end: number): boolean {
  //   for (let index = word.length - end - 1; index >= start; --index) {
  //     const tile = grid[y][x + index];
  //     if (tile.empty === true &&
  //         !(tile.validWordWith & (1 << (word.charCodeAt(index) - Grid.A_CODE)))) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  private checkWord(grid: GridTile[][], word: string, x: number, y: number, start: string, end: string): boolean {
    if (end.length !== 0 && !word.endsWith(end)) return false;
    if (start.length !== 0 && !word.startsWith(start)) return false;

    const startLength = start.length;
    for (let index = word.length - end.length - 1; index >= startLength; --index) {
      const tile = grid[y][x + index];
      if (tile.isEmpty) {
        // check validWordWith with one letter
        if (!(tile.validWordWith & (1 << (word.charCodeAt(index) - 65)))) return false; // 65 is the ASCII code of 'A'
      } else {
        if (tile.code !== word.charCodeAt(index)) return false;
      }
    }
    return true;
  }

  private calcScore(grid: GridTile[][], word: string, x: number, y: number, tilesCount: number): number {
    let verticalScore = 0;
    let horizontalScore = 0;
    let horizontalWordCoeff = 1;
    for (let index = word.length - 1; index >= 0; --index) {
      const currentC = word.charAt(index);
      const tile = grid[y][x + index];
      const tileScore = tile.bonus.letterCoeff * (TILE_SCORE[currentC] || 0);
      horizontalScore += tileScore;
      horizontalWordCoeff *= tile.bonus.wordCoeff;
      if (tile.top.length !== 0 || tile.bottom.length !== 0) {
        verticalScore += (tile.verticalScore + tileScore) * tile.bonus.wordCoeff;
      }
    }
    horizontalScore *= horizontalWordCoeff;
    if (TILE_RACK_SIZE === tilesCount) horizontalScore += BINGO_BONUS;
    return verticalScore + horizontalScore;
  }

  private calcBestScore(grid: GridTile[][], word: string, x: number, y: number, letterCnt: number, blanks: string): { score: number; word: string } {
    let best = { score: 0, pos: -1 };
    for (let i = blanks.length - 1; i >= 0; --i) {
      const char = blanks.charAt(i);
      best = { score: 0, pos: -1 };
      for (let pos = word.length - 1; pos >= 0; --pos) {
        if (grid[y][x + pos].isEmpty && word.charAt(pos) === char) {
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

  private matchingWordsPerSpot(
    results: WordResult[],
    grid: GridTile[][],
    x: number,
    y: number,
    combinations: Combinations,
    spotCount: number,
    inverted: boolean,
    tile: GridTile,
    nextTile: GridTile,
    // patternLetters: Array<[number, number]>,
    extraLetters: string,
    oneResultOnly: boolean
  ): void {
    const hValid = extraLetters.length === 0;
    const combi = hValid ? combinations.strict : combinations.incomplete;
    // const start = tile.left.length;
    // const end = nextTile.right.length;
    const wordX = x - tile.left.length;

    for (let k = combi.length - 1; k >= 0; --k) {
      let [str, blanks] = combi[k];
      if (!hValid) {
        str = sortAsciiString(extraLetters, str);
      }

      const words = WORDS_BY_SORTED_LETTERS.get(str);
      if (!words) continue;

      const hasBlank = blanks.length !== 0;

      for (let l = words.length - 1; l >= 0; --l) {
        let word = words[l];

        // if ((hValid || this.checkHorizontalWord(word, tile.left, nextTile.right, patternLetters)) &&
        //     this.checkVerticalWords(grid, word, wordX, y, start, end)) {
        if (this.checkWord(grid, word, wordX, y, tile.left, nextTile.right)) {
          let score: number;

          if (hasBlank) {
            ({ score, word } = this.calcBestScore(grid, word, wordX, y, spotCount, blanks));
          } else {
            score = this.calcScore(grid, word, wordX, y, spotCount);
          }

          results.push(inverted
            ? { y: wordX, x: y, word, count: spotCount, dir: 'ttb', score }
            : { x: wordX, y, word, count: spotCount, dir: 'ltr', score }
          );
          if (oneResultOnly) return;
        }
      }
    }
  }

  public solve(letters: string): WordResult[] {
    const results: WordResult[] = [];
    const maxSpotCount = Math.min(letters.length, TILE_RACK_SIZE);
    const allCombinations = new CombinationGenerator(letters, WORDS_BY_SORTED_LETTERS).generate();
    this.solveHorizontal(results, allCombinations, maxSpotCount, false, false);
    this.solveHorizontal(results, allCombinations, maxSpotCount, true, false);
    return results;
  }

  public isGameStuck(userLetters: string[]): boolean {
    const results: WordResult[] = [];
    for (let i = userLetters.length - 1; i >= 0; --i) {
      const letters = userLetters[i];
      const maxSpotCount = Math.min(letters.length, TILE_RACK_SIZE);
      const allCombinations = new CombinationGenerator(letters, WORDS_BY_SORTED_LETTERS).generate();
      if (this.solveHorizontal(results, allCombinations, maxSpotCount, false, true) ||
        this.solveHorizontal(results, allCombinations, maxSpotCount, true, true)) return false;
    }
    return true;
  }

  private solveHorizontal(
    results: WordResult[],
    allCombinations: Combinations[],
    maxSpotCount: number,
    inverted: boolean,
    oneResultOnly: boolean = false
  ): boolean {
    const grid = inverted ? this.vGrid : this.hGrid;
    const firstTurn = grid[7][7].isEmpty;

    for (let y = 0; y < 15; ++y) {
      for (let x = 0; x < 15; ++x) {
        const tile = grid[y][x];
        if (tile.valid === false) continue;

        let currentX = x;
        // let patternLetters: Array<[number, number]> = [];
        let extraLetters = tile.left;
        let validSpot = extraLetters.length !== 0;

        for (let spotCount = 0; spotCount !== maxSpotCount; ++currentX) {
          if (currentX > 14) break;

          const nextTile = grid[y][currentX];
          if (nextTile.isEmpty === true && nextTile.valid === false) break;

          if (nextTile.isEmpty === false) {
            extraLetters += nextTile.tileChar;
            // patternLetters.push([tile.left.length + currentX - x, nextTile.value.charCodeAt(0)]);
            continue;
          }

          ++spotCount;

          if (!validSpot) {
            if (firstTurn) {
              validSpot = y === 7 && currentX === 7; // center
            } else {
              validSpot = nextTile.top.length !== 0 || nextTile.bottom.length !== 0 || nextTile.right.length !== 0;
            }
          }

          if (validSpot && tile.left.length + spotCount + extraLetters.length + nextTile.right.length > 1) {
            this.matchingWordsPerSpot(
              results,
              grid,
              x,
              y,
              allCombinations[spotCount],
              spotCount,
              inverted,
              tile,
              nextTile,
              // patternLetters,
              extraLetters + nextTile.right,
              oneResultOnly
            );
            if (oneResultOnly && results.length > 0) return true;
          }
        }
      }
    }
    return !oneResultOnly;
  }
} 