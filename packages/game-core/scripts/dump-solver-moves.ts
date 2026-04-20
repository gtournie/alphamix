/**
 * Generates the H1 regression fixture for Board.test.ts.
 *
 * Runs moves() on the exact grid + rack used by scripts/test-solver.ts (FR locale),
 * sorts the resulting moves deterministically, and writes them as JSON to
 * src2/core/game/__test-utils__/h1-moves.json.
 *
 * Run once, commit the fixture. Re-run only if the solver legitimately evolves.
 *
 * Usage: bun run scripts/dump-solver-moves.ts
 */

import fs from 'fs';
import path from 'path';
import { Board } from '../src2/core/game/Board';
import LocaleData from '../src2/core/game/locale/locale-data';
import { parseRack, sortMoves } from '../src2/core/game/__test-utils__/solver-fixtures';

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

// Exact grid from scripts/test-solver.ts — kept in sync with that file.
const grid = [
  '...............',
  '...........T.V.',
  '..........JOUES',
  '...........N.L.',
  '..........AN.A.',
  '.......MOFLE.TA',
  '....G.....O...X',
  '...BADER..I...A',
  '....R.WURMS...I',
  '..FADEE.......U',
  '....E.SALEE....',
  'T.ZOU..HIT.....',
  'I.E.R..........',
  'POKES..........',
  'E..............',
].map(line => [...line]);

const rack = parseRack(localeData, [...'PTBYE??']);

const board = new Board(localeData, grid, rack);
const moves = [...board.moves().values()];
const sorted = sortMoves(moves);

fs.writeFileSync(FIXTURE_PATH, JSON.stringify(sorted, null, 2) + '\n');

console.log(`Wrote ${sorted.length} moves to ${FIXTURE_PATH}`);
console.log(`Best score: ${sorted[0]?.score} (${sorted[0]?.word.join('')} @ ${sorted[0]?.row},${sorted[0]?.col} ${sorted[0]?.dir})`);
