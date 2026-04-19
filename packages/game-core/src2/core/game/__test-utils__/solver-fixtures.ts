import fs from 'fs';
import path from 'path';
import LocaleData from '../locale/locale-data';
import { TILE_INFO_BY_LOCALES } from '../locale/tile-configs';
import { BLANK_ID, EMPTY_ID } from '../const';
import type { Move } from '../types';

const PROD_DICT_DIR = path.resolve(__dirname, '../../../../dictionaries/gaddag');
const TEST_DICT_PATH = path.resolve(__dirname, 'test-dict/gaddag.bin');

// Register the test locale `zxx` (BCP 47 "no linguistic content") as an alias of
// French scores/distributions — the test mini-dict uses the same latin alphabet.
// This lives in test utils so production `tile-configs.ts` stays test-free.
// Shallow clone: sharing the reference would let a future mutation on zxx
// cross-contaminate the real `fr` entry (and vice-versa).
// Idempotent: `test-dict/build.ts` registers the same alias. Re-running the
// assignment would replace the entry with a fresh clone (no harm today, but a
// future pre-registration elsewhere would be silently overwritten).
if (!TILE_INFO_BY_LOCALES.zxx) {
  TILE_INFO_BY_LOCALES.zxx = { ...TILE_INFO_BY_LOCALES.fr };
}

/**
 * `zxx` = BCP 47 "no linguistic content" → the synthetic test mini-dict under
 * `__test-utils__/test-dict/`. `fr` = the real French GADDAG under `dictionaries/`.
 */
export function loadLocale(name: 'zxx' | 'fr'): LocaleData {
  const binPath = name === 'zxx' ? TEST_DICT_PATH : path.join(PROD_DICT_DIR, `${name}.bin`);
  const buf = fs.readFileSync(binPath);
  const gaddagData = new Uint32Array(
    buf.buffer,
    buf.byteOffset,
    buf.length / Uint32Array.BYTES_PER_ELEMENT
  );
  return new LocaleData(name, gaddagData);
}

export function emptyGrid(): number[][] {
  return Array.from({ length: 15 }, () => new Array(15).fill(EMPTY_ID));
}

function charToCharId(locale: LocaleData): (c: string) => number {
  const map = new Array<number>(128).fill(EMPTY_ID);
  // Skip index 0: it's the separator slot ('+'), not a real letter. Mapping '+' to
  // char_id 0 would let a stray '+' in test input silently pass as a separator.
  for (let i = 1, len = locale.upperAlphabet.length; i < len; i++) {
    const upper = locale.upperAlphabet[i];
    const lower = locale.lowerAlphabet[i];
    map[upper.charCodeAt(0)] = i;
    map[lower.charCodeAt(0)] = i;
  }
  return (c: string) => {
    if (c === '.' || c === ' ') return EMPTY_ID;
    const code = c.charCodeAt(0);
    if (code >= map.length) return EMPTY_ID;
    return map[code];
  };
}

/**
 * Parses a 15-line grid description into number[][].
 * '.' or ' ' = empty. 'A'-'Z' = placed letter. 'a'-'z' = placed blank (stored as the same charId).
 * Each line must be exactly 15 characters.
 */
export function parseGrid(locale: LocaleData, lines: string[]): number[][] {
  if (lines.length !== 15) throw new Error(`Expected 15 lines, got ${lines.length}`);
  const toId = charToCharId(locale);
  return lines.map((line, i) => {
    if (line.length !== 15) throw new Error(`Line ${i} is ${line.length} chars, expected 15: "${line}"`);
    return [...line].map(toId);
  });
}

/**
 * Parses a rack string: '?' = blank, 'A'-'Z' (or 'a'-'z') = letter charId.
 */
export function parseRack(locale: LocaleData, str: string): number[] {
  const toId = charToCharId(locale);
  return [...str].map(c => {
    if (c === '?') return BLANK_ID;
    const id = toId(c);
    if (id === EMPTY_ID) throw new Error(`Unknown rack char '${c}' (not in alphabet nor blank)`);
    return id;
  });
}

export function findMove(
  moves: Map<string, Move>,
  predicate: Partial<Move>
): Move | undefined {
  for (const move of moves.values()) {
    let match = true;
    for (const key of Object.keys(predicate) as (keyof Move)[]) {
      if (move[key] !== predicate[key]) { match = false; break; }
    }
    if (match) return move;
  }
  return undefined;
}

/**
 * Like findMove, but throws a detailed error listing the best candidates if
 * no match is found. Use this in tests to avoid the opaque "expected undefined
 * to be defined" message.
 */
export function mustFindMove(
  moves: Map<string, Move>,
  predicate: Partial<Move>
): Move {
  const m = findMove(moves, predicate);
  if (m) return m;

  const all = [...moves.values()];
  // Score candidates by how closely they match the predicate
  const keys = Object.keys(predicate) as (keyof Move)[];
  const scored = all.map(mv => {
    let matched = 0;
    for (const k of keys) if (mv[k] === predicate[k]) matched++;
    return { mv, matched };
  });
  scored.sort((a, b) => b.matched - a.matched || b.mv.score - a.mv.score);

  const sample = scored.slice(0, 10).map(({ mv, matched }) =>
    `  [${matched}/${keys.length}] ${mv.word.padEnd(10)} row=${mv.row} col=${mv.col} ${mv.dir} score=${mv.score} used=${mv.usedLetters}`
  ).join('\n');

  throw new Error(
    `No move matches ${JSON.stringify(predicate)} (total ${all.length} moves).\n` +
    `Top 10 closest candidates:\n${sample}`
  );
}

export function bestMove(moves: Map<string, Move>): Move | undefined {
  let best: Move | undefined;
  for (const m of moves.values()) {
    if (!best || m.score > best.score) best = m;
  }
  return best;
}

/**
 * Deterministic ordering: (-score, word, row, col, dir).
 * Used for regression snapshots (H1) and determinism checks (G4).
 */
export function sortMoves(moves: Iterable<Move>): Move[] {
  return [...moves].sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.word !== b.word) return a.word < b.word ? -1 : 1;
    if (a.row !== b.row) return a.row - b.row;
    if (a.col !== b.col) return a.col - b.col;
    return a.dir < b.dir ? -1 : a.dir > b.dir ? 1 : 0;
  });
}
