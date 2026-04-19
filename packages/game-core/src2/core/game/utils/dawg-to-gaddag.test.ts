import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { convertDawgToGaddag } from './dawg-to-gaddag';
import { TILE_INFO_BY_LOCALES } from '../locale/tile-configs';
// Triggers the `zxx` alias side-effect so TILE_INFO_BY_LOCALES.zxx is populated.
import '../__test-utils__/solver-fixtures';

const TEST_DAWG_PATH = path.resolve(__dirname, '../__test-utils__/test-dict/dawg.bin');

function loadTestDawg(): Uint32Array {
  const buf = fs.readFileSync(TEST_DAWG_PATH);
  return new Uint32Array(buf.buffer, buf.byteOffset, buf.length / Uint32Array.BYTES_PER_ELEMENT);
}

describe('convertDawgToGaddag — alphabet length guard', () => {
  // The TS-side check throws before the WASM is even loaded, so the DAWG buffer
  // shape doesn't matter for these cases.
  const dummyDawg = new Uint32Array([0]);

  it('rejects alphabetLen === 0', async () => {
    await expect(convertDawgToGaddag(dummyDawg, 0)).rejects.toThrow(/MAX_ALPHABET/i);
  });

  it('rejects alphabetLen > MAX_ALPHABET (44)', async () => {
    await expect(convertDawgToGaddag(dummyDawg, 44)).rejects.toThrow(/MAX_ALPHABET/i);
  });

  it('rejects negative alphabetLen', async () => {
    await expect(convertDawgToGaddag(dummyDawg, -1)).rejects.toThrow(/MAX_ALPHABET/i);
  });
});

describe('convertDawgToGaddag — smoke test', () => {
  // Rides through the whole WASM pipeline and indirectly guards the
  // `input_consumed` ownership contract: if the flag was wrong, running the
  // converter twice in the same process would double-free the WASM heap and
  // crash on the second call.
  it('produces a GADDAG with sentinel at output[0] and runs twice without crashing', async () => {
    const alphabetLen = TILE_INFO_BY_LOCALES.zxx.ID_TO_CHAR.length;

    const gaddag1 = await convertDawgToGaddag(loadTestDawg(), alphabetLen);
    expect(gaddag1[0]).toBe(0); // Sentinel: rootIdx = 0 on the runtime side.
    expect(gaddag1.length).toBeGreaterThan(1);

    const gaddag2 = await convertDawgToGaddag(loadTestDawg(), alphabetLen);
    expect(gaddag2[0]).toBe(0);
    expect(gaddag2.length).toBe(gaddag1.length);
  });

  // Targeted regression for the C-side double-free: the pre-fix C returned
  // `output_buffer` to JS without nulling the global, so a second convert call
  // would have `reset_memory()` free the already-freed pointer. Running five
  // conversions back-to-back reliably drained emscripten's per-run grace and
  // crashed under the buggy version; with the fix it's a steady stream of
  // identical outputs.
  it('survives many consecutive conversions (double-free regression)', async () => {
    const alphabetLen = TILE_INFO_BY_LOCALES.zxx.ID_TO_CHAR.length;
    const first = await convertDawgToGaddag(loadTestDawg(), alphabetLen);
    for (let i = 0; i < 5; i++) {
      const next = await convertDawgToGaddag(loadTestDawg(), alphabetLen);
      expect(next[0]).toBe(0);
      expect(next.length).toBe(first.length);
    }
  });
});

describe('convertDawgToGaddag — malformed input guards', () => {
  // Guards the new C-side input-validation layer (M2 in the review). A zero
  // estimated-nodes header used to flow into `malloc(0)` (impl-defined) and
  // then UB on the first node write; an empty buffer would dereference input[0]
  // past the end. Both now fail cleanly with the JS wrapper's generic throw.
  const alphabetLen = TILE_INFO_BY_LOCALES.zxx.ID_TO_CHAR.length;

  it('rejects an empty input buffer', async () => {
    await expect(
      convertDawgToGaddag(new Uint32Array([]), alphabetLen)
    ).rejects.toThrow(/conversion failed/i);
  });

  it('rejects a header with estimated_nodes === 0', async () => {
    // Just the 1-word header saying "zero nodes needed" — semantically a
    // malformed DAWG that shouldn't reach the conversion path.
    await expect(
      convertDawgToGaddag(new Uint32Array([0]), alphabetLen)
    ).rejects.toThrow(/conversion failed/i);
  });

  it('rejects a header with estimated_nodes above the sane cap', async () => {
    // MAX_ESTIMATED_NODES is 2^28. One above that is outright rejected instead
    // of attempting a multi-GB malloc.
    await expect(
      convertDawgToGaddag(new Uint32Array([(1 << 28) + 1]), alphabetLen)
    ).rejects.toThrow(/conversion failed/i);
  });
});
