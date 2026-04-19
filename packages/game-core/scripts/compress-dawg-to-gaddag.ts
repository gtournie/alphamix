/**
 * Converts DAWG binaries (dictionaries/dawg/{locale}.bin)
 * into GADDAG binaries (dictionaries/gaddag/{locale}.bin) using the WASM converter.
 *
 * Only converts DAWGs that don't already have a GADDAG output — unless `--force`
 * is passed, in which case existing outputs are overwritten. Use `--force` any
 * time the GADDAG layout itself changes: without it, a stale binary with the
 * old layout would keep shipping silently.
 *
 * ⚠️ If the alphabet itself changed, rebuild BOTH sides together via
 * `bun run compress:all`. Running this script alone against a stale DAWG
 * produces a "freshly rebuilt" GADDAG with old char_ids — looks correct,
 * is silently corrupt. LocaleData's runtime shape-check catches the common
 * mismatches but cannot see reorderings that preserve the char_id set.
 *
 * DAWG layout:   [estimatedGaddagNodes, ...nodes]  — the C reads position 0 directly.
 * GADDAG layout: [sentinel=0, ...nodes]            — root's children start at index 1.
 *
 * The alphabet length is derived from TILE_INFO_BY_LOCALES[locale].ID_TO_CHAR.
 *
 * Usage: bun run scripts/compress-dawg-to-gaddag.ts [--force]
 */

import fs from 'fs';
import path from 'path';
import { convertDawgToGaddag } from '../src2/core/game/utils/dawg-to-gaddag.js';
import { TILE_INFO_BY_LOCALES } from '../src2/core/game/locale/tile-configs';

const DAWG_DIR = path.resolve(import.meta.dir, '../dictionaries/dawg');
const GADDAG_DIR = path.resolve(import.meta.dir, '../dictionaries/gaddag');
const FORCE = process.argv.includes('--force');

async function main() {
  if (!fs.existsSync(GADDAG_DIR)) {
    fs.mkdirSync(GADDAG_DIR, { recursive: true });
  }

  const files = fs.readdirSync(DAWG_DIR)
    .filter(f => f.endsWith('.bin'));

  if (files.length === 0) {
    console.log('No DAWG files found in', DAWG_DIR);
    return;
  }

  for (const file of files) {
    const locale = file.replace(/\.bin$/, '');
    const outputPath = path.join(GADDAG_DIR, file);

    if (!FORCE && fs.existsSync(outputPath)) {
      console.log(`[${locale}] Already converted, skipping (use --force to rebuild)`);
      continue;
    }

    const tileInfo = TILE_INFO_BY_LOCALES[locale];
    if (!tileInfo) {
      console.warn(`[${locale}] No TILE_INFO, skipping`);
      continue;
    }

    console.log(`[${locale}] Converting DAWG → GADDAG...`);

    const data = fs.readFileSync(path.join(DAWG_DIR, file));
    const fullDawg = new Uint32Array(
      data.buffer,
      data.byteOffset,
      data.length / Uint32Array.BYTES_PER_ELEMENT
    );

    const alphabetLen = tileInfo.ID_TO_CHAR.length;

    console.time(`  [${locale}] conversion`);
    // Pass the full buffer: DAWG pointers are absolute indices into it. Never slice
    // off position 0 — the C reads estimatedGaddagNodes from it.
    const gaddagData = await convertDawgToGaddag(fullDawg, alphabetLen);
    console.timeEnd(`  [${locale}] conversion`);

    await Bun.write(outputPath, new Uint8Array(gaddagData.buffer));

    const sizeKB = (gaddagData.byteLength / 1024).toFixed(1);
    console.log(`  Written ${outputPath} (${sizeKB} KB)`);
  }

  console.log('\nDone.');
}

main();
