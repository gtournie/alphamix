/**
 * Standalone builder for the digraph-stress test dictionary.
 *
 * Produces dawg.bin + gaddag.bin next to this file, under locale "zxx-di" —
 * a synthetic alphabet combining the 26 latin uppercase letters with the
 * digraphs CH, LL and the trigraph L·L. The whole point is to exercise the
 * multi-char tile code paths (tokenization, emitMove, key dedup).
 *
 * Usage:
 *   bun run src2/core/game/__test-utils__/test-dict-digraph/build.ts
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { compressToDawg } from '../../../../../scripts/compress-source-to-dawg';
import { convertDawgToGaddag } from '../../utils/dawg-to-gaddag';
import { TILE_INFO_BY_LOCALES } from '../../locale/tile-configs';
import { TILE_BLANK } from '../../const';
import type { LetterScore } from '../../types';

// `import.meta.dir` is Bun-only; under Vitest this module is imported just for
// its registerLocale() side effect and `import.meta.dir` is undefined, which
// crashes `path.resolve`. URL-based derivation works in both Bun and Node.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = path.resolve(HERE, 'source.js');
const DAWG_PATH = path.resolve(HERE, 'dawg.bin');
const GADDAG_PATH = path.resolve(HERE, 'gaddag.bin');

const LOCALE = 'zxx-di';

// Scores on digraphs are deliberately distinctive so tests can assert on them.
const TILE_SCORES: LetterScore = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 10, L: 1, M: 2, N: 1, O: 1, P: 3, Q: 8, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 10, X: 10, Y: 10, Z: 10,
  CH: 5, LL: 8, 'L·L': 10,
};

const TILE_DISTRIBUTIONS: Record<string, number> = {
  A: 9, B: 2, C: 2, D: 3, E: 15, F: 2, G: 2, H: 2, I: 8, J: 1,
  K: 1, L: 3, M: 3, N: 6, O: 6, P: 2, Q: 1, R: 6, S: 6, T: 6,
  U: 6, V: 2, W: 1, X: 1, Y: 1, Z: 1,
  CH: 1, LL: 1, 'L·L': 1,
  [TILE_BLANK]: 2,
};

registerLocale();

async function main() {
  const { default: dict } = (await import(SOURCE_PATH)) as { default: Map<string, string> };
  const words = [...dict.keys()];
  console.log(`  ${words.length} words loaded`);

  const dawg = compressToDawg(words, LOCALE);
  await Bun.write(DAWG_PATH, new Uint8Array(dawg.buffer));
  console.log(`  wrote ${DAWG_PATH} (${(dawg.byteLength / 1024).toFixed(1)} KB)`);

  const alphabetLen = TILE_INFO_BY_LOCALES[LOCALE].ID_TO_CHAR.length;
  const gaddag = await convertDawgToGaddag(dawg, alphabetLen);
  await Bun.write(GADDAG_PATH, new Uint8Array(gaddag.buffer));
  console.log(`  wrote ${GADDAG_PATH} (${(gaddag.byteLength / 1024).toFixed(1)} KB)`);
}

/**
 * Registers `zxx-di` into the runtime `TILE_INFO_BY_LOCALES`. Called at import
 * time so tests that `loadLocale('zxx-di')` don't need a separate init step.
 * Re-runs the same setup the production registration code in tile-configs.ts
 * performs (sort, ID_TO_CHAR, CHAR_TO_ID, TILE_BAG_NEW_CONTENT).
 */
export function registerLocale(): void {
  if (TILE_INFO_BY_LOCALES[LOCALE]) return;

  const letters = Object.keys(TILE_SCORES).sort();
  for (const k of letters) {
    if (k.normalize('NFC') !== k) {
      throw new Error(`TILE_SCORES key "${k}" is not NFC-normalized`);
    }
  }

  const idToCharMutable: string[] = new Array(letters.length + 1);
  idToCharMutable[0] = '+';
  for (let i = 0, len = letters.length; i < len; i++) idToCharMutable[i + 1] = letters[i];
  const ID_TO_CHAR: readonly string[] = Object.freeze(idToCharMutable);

  const CHAR_TO_ID = new Map<string, number>();
  for (let i = 1, len = ID_TO_CHAR.length; i < len; i++) CHAR_TO_ID.set(ID_TO_CHAR[i], i);

  TILE_INFO_BY_LOCALES[LOCALE] = {
    TILE_SCORES,
    TILE_DISTRIBUTIONS,
    TILE_BAG_NEW_CONTENT: Object.keys(TILE_DISTRIBUTIONS).reduce((acc: string[], letter) => {
      for (let i = 0, len = TILE_DISTRIBUTIONS[letter]; i < len; ++i) acc.push(letter);
      return acc;
    }, []),
    ID_TO_CHAR,
    CHAR_TO_ID,
  };
}

if (import.meta.main) main();
