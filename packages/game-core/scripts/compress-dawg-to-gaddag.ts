/**
 * Converts DAWG binaries (dictionaries/dawg/{locale}.bin)
 * into GADDAG binaries (dictionaries/gaddag/{locale}.bin) using the WASM converter.
 *
 * Only converts DAWGs that don't already have a GADDAG output.
 *
 * Usage: bun run scripts/compress-dawg-to-gaddag.ts
 */

import fs from 'fs';
import path from 'path';
import { convertDawgToGaddag } from '../src2/core/game/utils/dawg-to-gaddag.js';

const DAWG_DIR = path.resolve(import.meta.dir, '../dictionaries/dawg');
const GADDAG_DIR = path.resolve(import.meta.dir, '../dictionaries/gaddag');

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

    if (fs.existsSync(outputPath)) {
      console.log(`[${locale}] Already converted, skipping`);
      continue;
    }

    console.log(`[${locale}] Converting DAWG → GADDAG...`);

    const data = fs.readFileSync(path.join(DAWG_DIR, file));
    const dawgData = new Uint32Array(
      data.buffer,
      data.byteOffset,
      data.length / Uint32Array.BYTES_PER_ELEMENT
    );

    console.time(`  [${locale}] conversion`);
    const gaddagData = await convertDawgToGaddag(dawgData);
    console.timeEnd(`  [${locale}] conversion`);

    await Bun.write(outputPath, new Uint8Array(gaddagData.buffer));

    const sizeKB = (gaddagData.byteLength / 1024).toFixed(1);
    console.log(`  Written ${outputPath} (${sizeKB} KB)`);
  }

  console.log('\nDone.');
}

main();
