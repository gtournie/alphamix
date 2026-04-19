/**
 * Generates the H1 regression fixture for solver.test.ts.
 *
 * Runs solve() on the exact grid + rack used by scripts/test-solver.ts (FR locale),
 * sorts the resulting moves deterministically, and writes them as JSON to
 * src2/core/game/__test-utils__/h1-moves.json.
 *
 * Run once, commit the fixture. Re-run only if the solver legitimately evolves.
 *
 * Usage: bun run scripts/dump-solver-moves.ts
 */

import fs from 'fs';
import path from 'path';
import { Board } from '../src2/core/game/solver';
import LocaleData from '../src2/core/game/locale/locale-data';
import { BLANK_ID, EMPTY_ID, TILE_BLANK } from '../src2/core/game/const';
import { sortMoves } from '../src2/core/game/__test-utils__/solver-fixtures';

const LOCALE = 'fr';

const GADDAG_PATH = path.resolve(import.meta.dir, `../dictionaries/gaddag/${LOCALE}.bin`);
const FIXTURE_PATH = path.resolve(
  import.meta.dir,
  '../src2/core/game/__test-utils__/h1-moves.json'
);

const buf = fs.readFileSync(GADDAG_PATH);
const gaddagData = new Uint32Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint32Array.BYTES_PER_ELEMENT
);
const localeData = new LocaleData(LOCALE, gaddagData);

const toCharId = (c: string): number => {
  if (c === TILE_BLANK) return BLANK_ID;
  if (c === '.' || c === ' ') return EMPTY_ID; // grid placeholders
  return localeData.charToId(c); // throws on unknown — catches typos in the grid
};

// Exact grid from scripts/test-solver.ts:24-41
const grid = [
  "               ", // 0
  "           T V ", // 1
  "          JOUES", // 2
  "           N L ", // 3
  "          AN A ", // 4
  "       MOFLE TA", // 5
  "    G     O   X", // 6
  "   BADER  I   A", // 7
  "    R WURMS   I", // 8
  "  FADEE       U", // 9
  "    E SALEE    ", // 10
  "T ZOU  HIT     ", // 11
  "I E R          ", // 12
  "POKES          ", // 13
  "E              ", // 14
].map(line => [...line].map(toCharId));

const rack = [...'PTBYE??'].map(toCharId);

const board = new Board(localeData, grid, rack);
const moves = [...board.solve().values()];
const sorted = sortMoves(moves);

fs.writeFileSync(FIXTURE_PATH, JSON.stringify(sorted, null, 2) + '\n');

console.log(`Wrote ${sorted.length} moves to ${FIXTURE_PATH}`);
console.log(`Best score: ${sorted[0]?.score} (${sorted[0]?.word} @ ${sorted[0]?.row},${sorted[0]?.col} ${sorted[0]?.dir})`);
