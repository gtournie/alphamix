import fs from 'fs';
import path from 'path';
import LocaleData from '../locale/locale-data';
import { TILE_INFO_BY_LOCALES } from '../locale/tile-configs';
import { BLANK_ID, BOARD_EMPTY_SQUARE } from '../const';
import type { Move } from '../types';

// Importing test-dict-digraph/build.ts runs its top-level registerLocale() —
// populates TILE_INFO_BY_LOCALES['zxx-di'] with the digraph-stress alphabet.
// No side effect beyond that (the main() call is gated behind import.meta.main).
import './test-dict-digraph/build';

const PROD_DICT_DIR = path.resolve(__dirname, '../../../../dictionaries/gaddag');
const TEST_DICT_PATH = path.resolve(__dirname, 'test-dict/gaddag.bin');
const TEST_DIGRAPH_DICT_PATH = path.resolve(__dirname, 'test-dict-digraph/gaddag.bin');

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
 * - `zxx`    — synthetic latin mini-dict under `__test-utils__/test-dict/`.
 * - `zxx-di` — digraph-stress mini-dict under `__test-utils__/test-dict-digraph/`
 *   (adds tiles `CH`, `LL`, `L·L`). Used to exercise multi-char tokenization.
 * - `fr`     — real French GADDAG under `dictionaries/`.
 */
export function loadLocale(name: 'zxx' | 'zxx-di' | 'fr'): LocaleData {
  const binPath = name === 'zxx'
    ? TEST_DICT_PATH
    : name === 'zxx-di'
      ? TEST_DIGRAPH_DICT_PATH
      : path.join(PROD_DICT_DIR, `${name}.bin`);
  const buf = fs.readFileSync(binPath);
  const gaddagData = new Uint32Array(
    buf.buffer,
    buf.byteOffset,
    buf.length / Uint32Array.BYTES_PER_ELEMENT
  );
  return new LocaleData(name, gaddagData);
}

/**
 * Empty 15×15 grid in the textual format Board accepts.
 */
export function emptyGrid(): string[][] {
  return Array.from({ length: 15 }, () => new Array(15).fill(BOARD_EMPTY_SQUARE));
}

/**
 * Maps an array of tile strings to their charIds. `'?'` → `BLANK_ID`. Tiles
 * must be already-uppercase and known to the locale — game-core trusts its
 * callers. Callers provide explicit tiles (e.g. `["CH","A","T","?"]`) so the
 * parser stays unambiguous on digraph-alphabet locales.
 */
export function parseRack(locale: LocaleData, tiles: readonly string[]): number[] {
  return tiles.map(t => t === '?' ? BLANK_ID : locale.charToId(t));
}

/**
 * `word` and `usedLetters` can be passed as a plain string for readability —
 * the helper joins the Move's tile-array with '' before comparing. Other Move
 * fields use strict equality.
 */
export type MovePredicate = {
  word?: string | readonly string[];
  usedLetters?: string | readonly string[];
  score?: number;
  row?: number;
  col?: number;
  dir?: 'H' | 'V';
};

function predicateMatches(move: Move, predicate: MovePredicate): boolean {
  for (const key of Object.keys(predicate) as (keyof MovePredicate)[]) {
    const expected = predicate[key];
    if (expected === undefined) continue;
    if (key === 'word' || key === 'usedLetters') {
      const actual = move[key];
      const expectedStr = typeof expected === 'string' ? expected : (expected as readonly string[]).join('');
      if (actual.join('') !== expectedStr) return false;
    } else if ((move as unknown as Record<string, unknown>)[key] !== expected) {
      return false;
    }
  }
  return true;
}

export function findMove(
  moves: Map<string, Move>,
  predicate: MovePredicate
): Move | undefined {
  for (const move of moves.values()) {
    if (predicateMatches(move, predicate)) return move;
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
  predicate: MovePredicate
): Move {
  const m = findMove(moves, predicate);
  if (m) return m;

  const all = [...moves.values()];
  // Score candidates by how closely they match the predicate
  const keys = Object.keys(predicate) as (keyof MovePredicate)[];
  const scored = all.map(mv => {
    let matched = 0;
    for (const k of keys) {
      const expected = predicate[k];
      if (expected === undefined) continue;
      if (k === 'word' || k === 'usedLetters') {
        const actual = mv[k].join('');
        const exp = typeof expected === 'string' ? expected : (expected as readonly string[]).join('');
        if (actual === exp) matched++;
      } else if ((mv as unknown as Record<string, unknown>)[k] === expected) {
        matched++;
      }
    }
    return { mv, matched };
  });
  scored.sort((a, b) => b.matched - a.matched || b.mv.score - a.mv.score);

  const sample = scored.slice(0, 10).map(({ mv, matched }) =>
    `  [${matched}/${keys.length}] ${mv.word.join('').padEnd(10)} row=${mv.row} col=${mv.col} ${mv.dir} score=${mv.score} used=${mv.usedLetters.join('')}`
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
    const aw = a.word.join('');
    const bw = b.word.join('');
    if (aw !== bw) return aw < bw ? -1 : 1;
    if (a.row !== b.row) return a.row - b.row;
    if (a.col !== b.col) return a.col - b.col;
    return a.dir < b.dir ? -1 : a.dir > b.dir ? 1 : 0;
  });
}
