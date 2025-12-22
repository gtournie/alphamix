import { HISTORY_ENTRY_SCAN_REG } from "./const";
import { InvalidHistoryError } from "./Exceptions";
import { HistoryEntry } from "./HistoryEntry";

// 1st char: History delimiter
// 2nd char: Y coordinate (A:0, B:1, ..., P:15) if 1st char was not SKIP_TURN
// 3rd char: X coordinate (A:0, B:1, ..., P:15) if 1st char was not SKIP_TURN
// 4th char: Chars played. Use Object.keys(Tile.DISTRIBUTION).join('') as alphabet. No '?' at the end
// 5th char: Drawn tiles, (Use Object.keys(Tile.DISTRIBUTION).join('') as alphabet) separated by HistoryEntry.DRAW_SEPARATOR

// Should do it in 2 times. First validate if not SKIP_TURN, then validate the rest




export class History {
  // static readonly HISTORY_ENTRY_CHECK_REG_CONTENT = (() => {
  //   const wordSeps = History.DELIMITERS.HORIZONTAL_WORD + History.DELIMITERS.VERTICAL_WORD;
  //   const drawnSep = HistoryEntry.DRAW_SEPARATOR;
  //   const drawn = `(?:${drawnSep}[${escapeRegexp(this.ALPHABET)}]*)?`;

  //   const sep = `[${escapeRegexp(wordSeps)}]`;
  //   const axis = '[A-P]{2}';
  //   const chars = `(?:[${escapeRegexp(this.ALPHABET_WITH_BLANKS)}]*[${escapeRegexp(this.ALPHABET)}])?`;
  //   const word = `(?:${sep}${axis}${chars}${drawn})`;

  //   const skipSep = History.DELIMITERS.SKIP_TURN;
  //   const changed = `[${escapeRegexp(this.ALPHABET_WITH_BLANKS)}]*`
  //   const skip = `(?:${skipSep}${changed}${drawn})`;
  //   return `${word}|${skip}`;
  // })();

  private initialPlayerIndex: number;
  private entries: HistoryEntry[];

  constructor(history: string, private playerCount = NaN, currentPlayerIndex = NaN) {
    this.entries = (history.match(HISTORY_ENTRY_SCAN_REG) || []).map(part => new HistoryEntry(part));
    this.initialPlayerIndex = ((currentPlayerIndex - this.entries.length) % playerCount + playerCount) % playerCount;
  }

  // get hasTileChangeTurn() {
  //   return this.entries.some((entry) => entry.isChangeTilesTurn);
  // }

  get boardVersion() {
    return this.entries.reduce((s, entry) => s + entry.boardVersion, '');
  }

  get isGameOver() {
    if (isNaN(this.playerCount)) throw new InvalidHistoryError();
    const count = this.playerCount * 2;
    const entries = this.entries.slice(-count);
    return entries.length === count && entries.every((entry) => entry.isPassTurn);
  }

  forEach(func: (part: HistoryEntry, playerIndex: number, index: number) => void) {
    this.entries.forEach((entry, index) => {
      func(entry, (this.initialPlayerIndex + index) % this.playerCount, index)
    });
  }

  // static encode(text: string): Uint8Array {
  //   const totalBits = 3 + text.length * HISTORY_ENCODING_BITS_PER_CHAR; // +3 bits for padding length info
  //   const totalBytes = Math.ceil(totalBits / 8);
  //   const buffer = new Uint8Array(totalBytes);

  //   let bitPos = 3; // Start after the 3 bits reserved for length
  //   for (let i = 0, len = text.length; i < len; ++i) {
  //     const value = HISTORY_ALPHABET_WITH_BLANKS.indexOf(text.charAt(i));
  //     if (value < 0) throw new InvalidHistoryError();

  //     for (let i = HISTORY_ENCODING_BITS_PER_CHAR - 1; i >= 0; --i) {
  //       const bit = (value >> i) & 1;
  //       const byteIndex = Math.floor(bitPos / 8);
  //       const bitIndex = 7 - (bitPos % 8);
  //       buffer[byteIndex] |= bit << bitIndex;
  //       ++bitPos;
  //     }
  //   }

  //   // Store the 3 bits of useful length (modulo 8) in the first 3 bits of the first byte
  //   const lengthMod8 = totalBits % 8;
  //   buffer[0] |= (lengthMod8 & 0b111) << 5;

  //   return buffer;
  // }

  // static decode(buffer: Uint8Array): string {
  //   const lengthMod8 = (buffer[0] >> 5) & 0b111;
  //   const totalBits = (buffer.length - 1) * 8 + (lengthMod8 || 8);

  //   let bitPos = 3; // Skip the 3 bits used for length
  //   let chars: string = '';

  //   while (bitPos + HISTORY_ENCODING_BITS_PER_CHAR <= totalBits) {
  //     let value = 0;
  //     for (let i = 0; i < HISTORY_ENCODING_BITS_PER_CHAR; i++) {
  //       const byteIndex = Math.floor(bitPos / 8);
  //       const bitIndex = 7 - (bitPos % 8);
  //       const bit = (buffer[byteIndex] >> bitIndex) & 1;
  //       value = (value << 1) | bit;
  //       bitPos++;
  //     }
  //     chars += HISTORY_ALPHABET_WITH_BLANKS[value];
  //   }

  //   return chars;
  // }

}
