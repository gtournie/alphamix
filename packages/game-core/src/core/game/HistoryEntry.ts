import { HISTORY_DELIMITER_VALUES, HISTORY_DELIMITERS, HISTORY_ENTRY_DRAW_SEPARATOR, TILE_RACK_SIZE, HISTORY_ENTRY_CHARS_REG, HISTORY_ENTRY_DRAW_REG, TILE_BLANK } from "./const";
import { HistorySymbol } from "./types";
import { parseInt15 } from "./utils";


export class HistoryEntry {
  public chars: string = '';
  public drawn: string = '';
  public x: number = -1;
  public y: number = -1;
  private type: HistorySymbol;

  constructor(entry: string) {
    this.type = entry.charAt(0) as HistorySymbol;
    if (this.isFirstDraw) {
      this.drawn = entry.slice(1);
    } else if (this.isNonPlayTurn) {
      [this.chars, this.drawn = ''] = entry.slice(1).split(HISTORY_ENTRY_DRAW_SEPARATOR);
    } else if (this.isWordTurn) {
      this.y = parseInt15(entry.charAt(1));
      this.x = parseInt15(entry.charAt(2));
      [this.chars, this.drawn = ''] = entry.slice(3).split(HISTORY_ENTRY_DRAW_SEPARATOR);
    }
  }

  get boardVersion() {
    if (this.isFirstDraw) return '';
    // Change tiles or skip turn
    if (!this.isWordTurn) {
      // anonymize data with blank tiles
      return this.type + TILE_BLANK.repeat(this.chars.length);
    }
    return this.type + (this.y.toString(15) + this.x.toString(15)).toUpperCase() + this.chars;
  }

  get isFirstDraw() {
    return this.type === HISTORY_DELIMITERS.FIRST_DRAW;
  }

  get isWordTurn() {
    return [HISTORY_DELIMITERS.HORIZONTAL_WORD_TURN, HISTORY_DELIMITERS.VERTICAL_WORD_TURN].includes(this.type);
  }

  get isHorizontalWordTurn() {
    return this.type === HISTORY_DELIMITERS.HORIZONTAL_WORD_TURN;
  }

  get isVerticalWordTurn() {
    return this.type === HISTORY_DELIMITERS.VERTICAL_WORD_TURN;
  }

  get isNonPlayTurn() {
    return this.type === HISTORY_DELIMITERS.NON_PLAY_TURN;
  }

  get isPassTurn() {
    return this.type === HISTORY_DELIMITERS.NON_PLAY_TURN && this.chars.length === 0;
  }

  get isChangeTilesTurn() {
    return this.type === HISTORY_DELIMITERS.NON_PLAY_TURN && this.chars.length > 0;
  }

  get valid() {
    if (!HISTORY_DELIMITER_VALUES.includes(this.type)) return false;

    if (this.isFirstDraw) {
      if (!HISTORY_ENTRY_DRAW_REG.test(this.drawn)) return false;
      if (this.drawn.length !== TILE_RACK_SIZE) return false;
    } else if (this.isNonPlayTurn) {
      if (!HISTORY_ENTRY_DRAW_REG.test(this.chars)) return false;
      if (!HISTORY_ENTRY_DRAW_REG.test(this.drawn)) return false;
      if (this.chars.length > TILE_RACK_SIZE) return false;
      if (this.drawn.length > 0 && this.drawn.length !== this.chars.length) return false;
    } else { // word
      if (!(this.y >= 0 && this.y < 15)) return false;
      if (!(this.x >= 0 && this.x < 15)) return false;
      if (this.chars.length < 1) return false;
      if (!HISTORY_ENTRY_CHARS_REG.test(this.chars)) return false;
      if (!HISTORY_ENTRY_DRAW_REG.test(this.drawn)) return false;
      if (this.chars.length > TILE_RACK_SIZE) return false;
      if (this.drawn.length > this.chars.length) return false;
    }
    return true;
  }
}




