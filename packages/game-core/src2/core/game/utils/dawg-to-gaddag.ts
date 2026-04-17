import factory from '../wasm/gaddag.js';

/**
 * Converts a DAWG (Uint32Array) to a GADDAG (Uint32Array) using the WASM converter.
 * The DAWG and GADDAG share the same binary header format (alphabet).
 */
export async function convertDawgToGaddag(dawgData: Uint32Array): Promise<Uint32Array> {
  const mod = await factory();
  const inLen = dawgData.length;
  const inPtr = mod._malloc(inLen * 4);
  const outLenPtr = mod._malloc(4);

  try {
    mod.HEAPU32.set(dawgData, inPtr >> 2);

    const outPtr = mod._convert_dawg_to_gaddag(inPtr, inLen, outLenPtr);
    if (outPtr === 0) throw new Error('DAWG to GADDAG conversion failed');

    const outLen = mod.HEAPU32[outLenPtr >> 2];
    return new Uint32Array(mod.HEAPU32.subarray(outPtr >> 2, (outPtr >> 2) + outLen));
  } finally {
    mod._free(inPtr);
    mod._free(outLenPtr);
  }
}
