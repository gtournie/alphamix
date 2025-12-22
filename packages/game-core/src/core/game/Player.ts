import type { PlayerTile } from './types';

export class Player {
  name: string;
  score: number;
  tiles: string[];
  playedWords: { word: string; tiles: PlayerTile[] }[];

  /**
   * Initializes a player with a name and a set of tiles.
   */
  constructor(name: string, tiles: string[]) {
    this.name = name;
    this.tiles = tiles;
    this.score = 0;
    this.playedWords = [];
  }

  /**
   * Adds points to the player's score.
   */
  addScore(points: number): void {
    this.score += points;
  }

  /**
   * Records a word played by the player along with the tiles used.
   */
  addPlayedWord(word: string, tiles: PlayerTile[]): void {
    this.playedWords.push({ word, tiles });
  }

  /**
   * Replaces the player's used tiles with new ones.
   * Removes the used tiles from the player's hand and adds the new tiles.
   */
  replaceTiles(usedTiles: string[], newTiles: string[]): void {
    usedTiles.forEach(usedTile => {
      const index = this.tiles.indexOf(usedTile);
      if (index !== -1) {
        this.tiles.splice(index, 1);
      }
    });
    this.tiles.push(...newTiles);
  }
}