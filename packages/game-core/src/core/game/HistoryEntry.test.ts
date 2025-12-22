import { describe, it, expect } from 'vitest';
import { TILE_BLANK, HISTORY_DELIMITERS, TILE_DISTRIBUTION, HISTORY_ENTRY_DRAW_SEPARATOR, TILE_RACK_SIZE } from './const';
import { HistoryEntry } from './HistoryEntry';

const ALPHABET = Object.keys(TILE_DISTRIBUTION);
const FILTERED_ALPHABET = ALPHABET.filter(c => c !== TILE_BLANK);

function generateValidHistoryEntry() {
  // Define a string which will store the history entry
  let entry = '';

  // Skip turn and change letters
  if (Math.random() < 0.3) {
    entry += HISTORY_DELIMITERS.NON_PLAY_TURN; // skip turn
    let numChars = Math.floor(Math.random() * TILE_RACK_SIZE + 1);
    for (let i = 0; i < numChars; ++i) {
      entry += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    entry += HISTORY_ENTRY_DRAW_SEPARATOR;
    for (let i = 0; i < numChars; ++i) {
      entry += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
  } else if (Math.random() < 0.05) {
    entry += HISTORY_DELIMITERS.FIRST_DRAW; // first turn
    for (let i = 0; i < TILE_RACK_SIZE; ++i) {
      entry += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
  } else {
    entry += Math.random() < 0.5 ? HISTORY_DELIMITERS.HORIZONTAL_WORD_TURN : HISTORY_DELIMITERS.VERTICAL_WORD_TURN; // horizontal or vertical word
    entry += (Math.floor(Math.random() * 15)).toString(15).toUpperCase(); // Y coordinate
    entry += (Math.floor(Math.random() * 15)).toString(15).toUpperCase(); // X coordinate
    let numChars = Math.floor(Math.random() * TILE_RACK_SIZE) + 1; // At least 1 char
    for (let i = 0; i < numChars; ++i) {
      let char = FILTERED_ALPHABET[Math.floor(Math.random() * FILTERED_ALPHABET.length)];
      if (Math.random() < 0.05) char = char.toLowerCase();
      entry += char;
    }
    if (numChars > 0 || Math.random() < 0.5) {
      entry += HISTORY_ENTRY_DRAW_SEPARATOR;
      numChars = Math.floor(Math.random() * numChars + 1);
      for (let i = 0; i < numChars; ++i) {
        entry += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }
  return entry;
}

describe('HistoryEntry', () => {
  it('should parse historyEntry correctly', () => {
    const historyEntry = '|77EXEmPLE:DRAWN';
    const entry = new HistoryEntry(historyEntry);

    expect(entry.isVerticalWordTurn).toBe(true);
    expect(entry.y).toBe(7);
    expect(entry.x).toBe(7);
    expect(entry.chars).toBe('EXEmPLE');
    expect(entry.drawn).toBe('DRAWN');
  });

  it('should validate historyEntry properly a thousand times', () => {
    for (let i = 0; i < 1000; i++) {
      const historyEntry = generateValidHistoryEntry();
      const entry = new HistoryEntry(historyEntry);
      if (!entry.valid) console.log(historyEntry)
      expect(entry.valid).toBe(true);
    }
  });

  it('should validate historyEntry without drawn letters', () => {
    const historyEntry = '|77EXEmPLE';
    const entry = new HistoryEntry(historyEntry);
    if (!entry.valid) console.log(historyEntry)
    expect(entry.valid).toBe(true);
    expect(entry.chars).toBe('EXEmPLE');
    expect(entry.drawn).toBe('');

    expect(new HistoryEntry('|77EXEmPLE:').valid).toBe(true);
  });

  it('should not validate historyEntry', () => {
    const invalidEntries = [
      '*', // Invalid type
      '=A', // Invalid first turn (chars too short)
      '*77EXEMPLE', // Invalid type
      '|77$d3^:DRAWN', // Invalid chars letters
      '|77', // Invalid chars count
      '|77EXE?MPLE:12', // Invalid chars letters
      '|77EXEmPLE:12', // Invalid drawn letters
      '-FEEXEmPLE:DRAWN', // Invalid y coordinates
      '-EFEXEmPLE:DRAWN', // Invalid x coordinates
      '|77EXEmPLES:DRAWN', // chars too long
      '|77EXEmPLE:DRDRDRDR', // Drawn letters longer than chars
      '!EXEmPLE:DRAWN', // Skip turn with chars.length !== drawn.length
      '!EXEmPLE:DRAW', // Skip turn with chars.length too long
      '!EXEMPLES:DRAW', // Skip turn with chars.length too long
    ];

    for (const entry of invalidEntries) {
      const historyEntry = new HistoryEntry(entry);
      expect(historyEntry.valid).toBe(false);
    }
  });

  // it('should check that all historyEntry chars are included in tile-rack chars', () => {
  //   const historyEntry = '|77TEmPLE';
  //   const entry = new HistoryEntry(historyEntry);
  //   expect(entry.checkTileRackChars('TAE?PLE')).toBe(true);
  //   expect(entry.checkTileRackChars('TAE?PL')).toBe(false);
  // })
});