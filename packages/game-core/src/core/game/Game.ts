import { Player } from './Player';
import { Board } from './Board';
import type { PlayerTile as BoardTile, CheckLettersResult } from './types';
import { TILE_DISTRIBUTION, BOARD_EMPTY_SQUARE } from './const';

export class Game {
  private tileBag: string[];
  private board: Board;
  private players: Player[];
  private currentPlayerIndex: number;

  /**
   * Initializes the game with a list of player names.
   * Creates the tile bag, board, and players.
   */
  constructor(playerNames: string[]) {
    this.tileBag = this.initializeTileBag();
    this.board = new Board(this.createInitialGrid());
    this.players = playerNames.map(name => new Player(name, this.drawTiles(7)));
    this.currentPlayerIndex = 0;
  }

  /**
   * Creates the initial tile bag based on the tile distribution.
   * Shuffles the tiles before returning them.
   */
  private initializeTileBag(): string[] {
    const tiles: string[] = [];
    for (const [tile, count] of Object.entries(TILE_DISTRIBUTION)) {
      for (let i = 0; i < count; i++) {
        tiles.push(tile);
      }
    }
    return this.shuffle(tiles);
  }

  /**
   * Creates an empty grid for the board.
   */
  private createInitialGrid(): string[][] {
    return Board.createGrid(() => BOARD_EMPTY_SQUARE);
  }

  /**
   * Shuffles an array using the Fisher-Yates algorithm.
   */
  private shuffle(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Draws a specified number of tiles from the tile bag.
   * If the bag is empty, fewer tiles may be returned.
   */
  private drawTiles(count: number): string[] {
    const drawnTiles: string[] = [];
    for (let i = 0; i < count && this.tileBag.length > 0; i++) {
      drawnTiles.push(this.tileBag.pop()!);
    }
    return drawnTiles;
  }

  /**
   * Returns the current player based on the turn index.
   */
  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  /**
   * Handles the logic for playing a word on the board.
   * Validates the move, updates the player's score and tiles, and advances the turn.
   */
  playWord(player: Player, boardTiles: BoardTile[]): boolean {
    const checkResult: CheckLettersResult = this.board.checkLetters(boardTiles);

    if (!checkResult.valid) {
      console.error(`Invalid move: ${checkResult.error}`);
      return false;
    }

    player.addPlayedWord(checkResult.word, boardTiles);
    player.addScore(checkResult.score);
    player.replaceTiles(boardTiles.map(tile => tile.char), this.drawTiles(boardTiles.length));
    this.nextTurn();

    if (this.isGameOver()) {
      console.log('Game over!');
    }

    return true;
  }

  /**
   * Advances the turn to the next player in the list.
   */
  private nextTurn(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  /**
   * Checks if the game is over.
   * The game ends if the tile bag is empty and a player has no tiles left.
   */
  private isGameOver(): boolean {
    return this.tileBag.length === 0 && this.players.some(player => player.tiles.length === 0);
  }

  /**
   * Returns the current state of the board.
   */
  getBoard(): Board {
    return this.board;
  }

  /**
   * Returns the list of players in the game.
   */
  getPlayers(): Player[] {
    return this.players;
  }
}