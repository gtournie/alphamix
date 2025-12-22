import { TILE_BLANK, TILE_SCORE } from "./const";

export class TileRack {
  private tiles: string[];

  constructor(content: string) {
    this.tiles = content.split('');
  }

  get content() {
    return this.tiles.join('');
  }

  get value() {
    return this.tiles.reduce((sum, tile) => sum + (TILE_SCORE[tile] || 0), 0);
  }

  add(chars: string) {
    this.tiles.push(...chars.split(''));
  }

  remove(chars: string) {
    for (let i = chars.length - 1; i >= 0; --i) {
      let char = chars.charAt(i);
      if (char === char.toLowerCase()) char = TILE_BLANK;
      const index = this.tiles.indexOf(char);
      if (index < 0) return false;
      this.tiles.splice(index, 1);
    }
    return true;
  }
}