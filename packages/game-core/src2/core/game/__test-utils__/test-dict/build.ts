/**
 * Standalone builder for the solver test mini-dictionary.
 *
 * Reads source.js (a `Map<string, string>`), produces dawg.bin + gaddag.bin
 * next to this file. Reuses the production DAWG and GADDAG compression
 * functions — no duplicated logic.
 *
 * Usage:
 *   bun run src2/core/game/__test-utils__/test-dict/build.ts
 */

import path from 'path';
import { compressToDawg } from '../../../../../scripts/compress-source-to-dawg';
import { convertDawgToGaddag } from '../../utils/dawg-to-gaddag';
import { TILE_INFO_BY_LOCALES } from '../../locale/tile-configs';

const HERE = import.meta.dir;
const SOURCE_PATH = path.resolve(HERE, 'source.js');
const DAWG_PATH = path.resolve(HERE, 'dawg.bin');
const GADDAG_PATH = path.resolve(HERE, 'gaddag.bin');

// BCP 47 "no linguistic content". Safe for toLocaleUpperCase and signals the
// dict is synthetic test data, not any real language.
const LOCALE = 'zxx';
// Alias zxx scores/alphabet to the French config (same latin alphabet).
// Shallow clone so a future mutation of either entry doesn't cross-contaminate.
// Idempotent: solver-fixtures.ts registers the same alias on its first import.
if (!TILE_INFO_BY_LOCALES[LOCALE]) {
  TILE_INFO_BY_LOCALES[LOCALE] = { ...TILE_INFO_BY_LOCALES.fr };
}

async function main() {
  const { default: dict } = (await import(SOURCE_PATH)) as { default: Map<string, string> };
  const words = [...dict.keys()].map(w => w.toLocaleUpperCase(LOCALE));
  console.log(`  ${words.length} words loaded`);

  const dawg = compressToDawg(words, LOCALE);
  await Bun.write(DAWG_PATH, new Uint8Array(dawg.buffer));
  console.log(`  wrote ${DAWG_PATH} (${(dawg.byteLength / 1024).toFixed(1)} KB)`);

  const alphabetLen = TILE_INFO_BY_LOCALES[LOCALE].ID_TO_CHAR.length;
  const gaddag = await convertDawgToGaddag(dawg, alphabetLen);
  await Bun.write(GADDAG_PATH, new Uint8Array(gaddag.buffer));
  console.log(`  wrote ${GADDAG_PATH} (${(gaddag.byteLength / 1024).toFixed(1)} KB)`);
}

main();
