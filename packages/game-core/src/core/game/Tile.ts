import { TILE_BLANK } from "./const";

export class Tile {
  static isBlank(char: string) {
    return char === TILE_BLANK || char.toLowerCase() === char;
  }

  public char: string;
  public x: number;
  public y: number;

  constructor(obj: { char: string, x: number, y: number }) {
    this.char = obj.char;
    this.x = obj.x;
    this.y = obj.y;
  }

  get isBlank(): boolean {
    return Tile.isBlank(this.char);
  }
}