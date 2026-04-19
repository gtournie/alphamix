import factory from '../wasm/gaddag.js';
// Shared with the C side via `#define MAX_ALPHABET` in wasm/gaddag_converter.c.
// The two MUST stay numerically equal — see the comment on the constant in
// `../const.ts` for why drift is silent and dangerous.
import { MAX_ALPHABET } from '../const';

/**
 * Converts a DAWG (Uint32Array) to a GADDAG (Uint32Array) using the WASM converter.
 *
 * DAWG layout (input):   [estimatedGaddagNodes, ...nodes]
 *   Pointers inside DAWG nodes are absolute indices into this full buffer — do NOT
 *   slice position 0 off before passing. The C reads `estimated_nodes = input[0]`
 *   to size its arena, and starts node traversal at index 1.
 * GADDAG layout (output): [sentinel=0, ...nodes]. The runtime-side `rootIdx` is a
 *   pure tag (= 0), translated by `findDataChild` to the real first-child index 1.
 *
 * The alphabet is derived from `TILE_INFO_BY_LOCALES[locale].ID_TO_CHAR`; only its
 * total length (letters + separator) is passed in. The binary is otherwise pure
 * nodes and carries no alphabet metadata.
 *
 * Memory ownership: the C converter reuses the input buffer as the output buffer
 * (shared pointer), growing via realloc if the output outgrows the input. After
 * the first realloc that relocates the buffer, `inPtr` is freed by realloc and
 * is no longer valid. We can't tell from the return value alone whether that
 * happened, so the C sets an out-param `input_consumed`: 0 = inPtr is still ours,
 * 1 = realloc has taken ownership at some point and inPtr must not be freed.
 *
 * ⚠ HEAP view safety: every `mod.HEAPU32[...]` access below goes through a
 * property read on the live Emscripten Module. When WASM memory grows (via
 * `_emscripten_resize_heap` inside the conversion), Emscripten re-assigns
 * `Module["HEAPU32"]` to a fresh Uint32Array view over the new buffer — the old
 * view is detached but we never cache it. DO NOT introduce `const HEAP = mod.HEAPU32`
 * at the top of this function: that local would be the old detached view after
 * any grow, and subsequent reads/writes would silently hit zeroed memory (or
 * throw, depending on the engine). Keep every HEAP access as `mod.HEAPU32.xxx`.
 */
export async function convertDawgToGaddag(
  dawgData: Uint32Array,
  alphabetLen: number
): Promise<Uint32Array> {
  if (alphabetLen <= 0 || alphabetLen > MAX_ALPHABET) {
    throw new Error(
      `alphabetLen=${alphabetLen} is out of range [1..${MAX_ALPHABET}]. ` +
      `MAX_ALPHABET (const.ts) sizes the C-side lookup tables — bump it in both gaddag_converter.c and const.ts if you need a bigger alphabet.`
    );
  }
  const mod = await factory();
  const inLen = dawgData.length;
  const inPtr = mod._malloc(inLen * 4);
  const outLenPtr = mod._malloc(4);
  const inputConsumedPtr = mod._malloc(4);
  let outPtr = 0;

  try {
    mod.HEAPU32.set(dawgData, inPtr >> 2);
    mod.HEAPU32[inputConsumedPtr >> 2] = 0;

    outPtr = mod._convert_dawg_to_gaddag(inPtr, inLen, alphabetLen, inputConsumedPtr, outLenPtr);
    if (outPtr === 0) throw new Error('DAWG to GADDAG conversion failed');

    const outLen = mod.HEAPU32[outLenPtr >> 2];
    return new Uint32Array(mod.HEAPU32.subarray(outPtr >> 2, (outPtr >> 2) + outLen));
  } finally {
    const inputConsumed = mod.HEAPU32[inputConsumedPtr >> 2] === 1;
    mod._free(outLenPtr);
    mod._free(inputConsumedPtr);
    // Success: outPtr owns the one live buffer (== inPtr iff no realloc happened).
    // Failure: outPtr === 0; free inPtr only if realloc didn't already consume it.
    if (outPtr !== 0) {
      mod._free(outPtr);
    } else if (!inputConsumed) {
      mod._free(inPtr);
    }
  }
}
