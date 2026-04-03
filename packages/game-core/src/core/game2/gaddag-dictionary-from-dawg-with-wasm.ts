// import fs from 'fs';
// import { dawg_to_gaddag } from './gaddag-builder/pkg/gaddag_builder_node.js';

// const dawgBytes = new Uint8Array(fs.readFileSync('dictionary.bin'));
// console.time('dawg_to_gaddag')
// const gaddagBytes = dawg_to_gaddag(dawgBytes);
// console.timeEnd('dawg_to_gaddag')
// fs.writeFileSync('gaddag-dictionary2.bin', gaddagBytes);

import fs from 'fs';
import factory from './gaddag-builder-c/gaddag.js';
import DB from '../../../data/1mot';

// const DB = new Map<string, true>();
// const data = fs.readFileSync('slowa.txt', 'utf-8');
// data.split('\n').forEach(line => {
//   const word = line.trim().toLocaleUpperCase('pl');
//   if (word.length > 0) {
//     DB.set(word, true);
//   }
// });


async function run() {
  const data = fs.readFileSync('dictionary.bin');
  const inputUint32 = new Uint32Array(data.buffer, data.byteOffset, data.length / 4);

  // Benchmark: run 10 times and compute average
  const NUM_RUNS = 1;
  const times: number[] = [];

  for (let run = 0; run < NUM_RUNS; run++) {
    // Load a fresh WASM module for each run to avoid state corruption
    const mod = await factory();
    const inLen = inputUint32.length;
    const inPtr = mod._malloc(inLen * 4);
    const outLenPtr = mod._malloc(4);

    try {
      mod.HEAPU32.set(inputUint32, inPtr >> 2);

      const startTime = performance.now();
      const outPtr = mod._convert_dawg_to_gaddag(inPtr, inLen, outLenPtr);
      const endTime = performance.now();
      console.log(`  Run ${run + 1}: ${(endTime - startTime).toFixed(2)}ms`);
      times.push(endTime - startTime);

      if (outPtr === 0) throw new Error(`Conversion failed at run ${run}`);

      // Last run: save the result
      if (run === NUM_RUNS - 1) {
        const finalLen = mod.HEAPU32[outLenPtr >> 2];
        const result = new Uint32Array(mod.HEAPU32.subarray(outPtr >> 2, (outPtr >> 2) + finalLen));
        fs.writeFileSync('gaddag-dictionary3.bin', Buffer.from(result.buffer));
        console.log(`Success! GADDAG size: ${finalLen} uint32 units.`);

        // Extract alphabet from header
        const alphabetLen = inputUint32[0];
        const ALPHABET: string[] = new Array(alphabetLen);
        for (let i = 0; i < alphabetLen; i++) {
          ALPHABET[i] = String.fromCharCode(inputUint32[i + 1]);
        }
        const SEPARATOR = ALPHABET[0];

        const ALPHABET_CODE_TO_CHAR_ID = new Array(65536);
        ALPHABET.forEach((c, index) => { ALPHABET_CODE_TO_CHAR_ID[c.charCodeAt(0)] = index; });



        function contains(data: Uint32Array, word: string): boolean {
          word = word.charAt(0) + SEPARATOR + word.slice(1);
          let currentIndex = data[0] + 1;
          const wordLen = word.length;

          for (let i = 0; i < wordLen; i++) {
            const targetCharId = ALPHABET_CODE_TO_CHAR_ID[word.charCodeAt(i)];
            let found = false;

            while (true) {
              const nodeVal = data[currentIndex];
              const charId = (nodeVal >>> 26) & 0x3F;
              const hasMore = (nodeVal >>> 24) & 0x1;

              if (charId === targetCharId) {
                if (i === wordLen - 1) return ((nodeVal >>> 25) & 0x1) === 1;
                currentIndex = nodeVal & 0xFFFFFF;
                found = true;
                break;
              }

              if (!hasMore) return false;
              currentIndex++;
            }

            if (!found) return false;
          }
          return false;
        }

        console.time('unfound');
        const unfound = [...DB.keys()].find((word: string) => !contains(result, word));
        console.timeEnd('unfound');
        console.log("Is Dictionary complete: " + (unfound ? "no" : "yes"));
        console.log(contains(result, "MARCHE"));
        console.log(contains(result, "PROCHE"));
        console.log(contains(result, "BIOTYPE"));
        console.log(contains(result, "ZXYZY"));
      }
    } finally {
      mod._free(inPtr);
      mod._free(outLenPtr);
    }
  }

  const avgTime = times.reduce((a, b) => a + b, 0) / NUM_RUNS;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  console.log(`\nGADDAG Conversion (${NUM_RUNS} runs):`);
  console.log(`  Min: ${minTime.toFixed(2)}ms`);
  console.log(`  Max: ${maxTime.toFixed(2)}ms`);
  console.log(`  Avg: ${avgTime.toFixed(2)}ms`);
}

run();


