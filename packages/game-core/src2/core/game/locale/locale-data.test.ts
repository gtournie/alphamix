import { beforeAll, describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import LocaleData from './locale-data';
import { SEPARATOR_ID } from '../const';
// Triggers the `zxx` alias side-effect registered on module load.
import '../__test-utils__/solver-fixtures';

const TEST_GADDAG_PATH = path.resolve(__dirname, '../__test-utils__/test-dict/gaddag.bin');

let zxx: LocaleData;

beforeAll(() => {
  const buf = fs.readFileSync(TEST_GADDAG_PATH);
  const gaddagData = new Uint32Array(buf.buffer, buf.byteOffset, buf.length / Uint32Array.BYTES_PER_ELEMENT);
  zxx = new LocaleData('zxx', gaddagData);
});

describe('LocaleData.findDataChild', () => {
  // Locks down the `parentNodeIdx === rootIdx` fast-path. Under the tag-based
  // layout, `rootIdx` is a sentinel (= 0) that doesn't index into the buffer —
  // passing it must translate to buffer index 1 and iterate root's siblings.
  it('rootIdx fast-path finds real letter children (A, Z)', () => {
    const aId = zxx.upperAlphabet.indexOf('A');
    const zId = zxx.upperAlphabet.indexOf('Z');
    expect(zxx.findDataChild(zxx.rootIdx, aId)).toBeGreaterThan(0);
    expect(zxx.findDataChild(zxx.rootIdx, zId)).toBeGreaterThan(0);
  });

  it('returns -1 for a char_id that isn\'t a root sibling (separator)', () => {
    // The separator never appears as a root sibling — it lives under each
    // letter's subtree. Requesting it from root must be -1.
    expect(zxx.findDataChild(zxx.rootIdx, SEPARATOR_ID)).toBe(-1);
  });

  // Defense in depth for `computeVerticalConstraint`'s left-walk (M1 fix). The
  // solver now breaks immediately on -1, but findDataChild must ALSO tolerate
  // -1 defensively so any future caller that forgets to check can't silently
  // corrupt state via `gaddag[-1]` OOB reads.
  it('findDataChild(-1, anyCharId) returns -1', () => {
    expect(zxx.findDataChild(-1, 1)).toBe(-1);
    expect(zxx.findDataChild(-1, SEPARATOR_ID)).toBe(-1);
    const zId = zxx.upperAlphabet.indexOf('Z');
    expect(zxx.findDataChild(-1, zId)).toBe(-1);
  });

  it('findDataChild on a leaf-like node (no children) returns -1', () => {
    // Walk through a simple word (AA): root → A → A.
    const aId = zxx.upperAlphabet.indexOf('A');
    const aNode = zxx.findDataChild(zxx.rootIdx, aId);
    expect(aNode).toBeGreaterThan(0);
    const aaNode = zxx.findDataChild(aNode, aId);
    expect(aaNode).toBeGreaterThan(0);
    // Asking for a char_id that doesn't appear as a child of AA must return -1,
    // never produce a spurious positive due to buffer-boundary aliasing.
    expect(zxx.findDataChild(aaNode, 99 /* out of alphabet */)).toBe(-1);
  });

  // Guards the `if (currentIdx === 0) return -1` safety check: an OOB-positive
  // parentNodeIdx makes `gaddag[parentNodeIdx]` undefined, then `undefined &
  // 0xFFFFFF === 0`, so `currentIdx` is 0 and the guard fires. The test pins
  // this contract — callers that forget to check the return value of a prior
  // findDataChild won't cascade into a positive OOB index.
  it('findDataChild on an out-of-range positive parent returns -1', () => {
    const beyond = zxx.gaddagData.length + 100;
    const zId = zxx.upperAlphabet.indexOf('Z');
    expect(zxx.findDataChild(beyond, zId)).toBe(-1);
    expect(zxx.findDataChild(beyond, SEPARATOR_ID)).toBe(-1);
    expect(zxx.findDataChild(zxx.gaddagData.length, 1)).toBe(-1);
  });
});

describe('LocaleData readonly invariants', () => {
  // `upperAlphabet` is typed `readonly string[]` and aliases
  // TILE_INFO_BY_LOCALES[locale].ID_TO_CHAR by reference. Without runtime
  // enforcement a cast-forced write would silently desync every future
  // LocaleData instance for the same locale from its GADDAG binary.
  //
  // Previous version of this test used a poke-restore pattern that itself
  // mutated the shared array — any crash or early-exit between poke and
  // restore left the whole process in a corrupted state. The freeze at
  // tile-configs.ts construction time gives a real runtime guarantee: the
  // write throws synchronously, nothing to restore, nothing to leak.
  it('upperAlphabet is frozen — index assignment throws in strict mode', () => {
    expect(Object.isFrozen(zxx.upperAlphabet)).toBe(true);
    expect(() => {
      (zxx.upperAlphabet as string[])[0] = 'DO-NOT-MUTATE';
    }).toThrow(TypeError);
    // Sanity: the array is genuinely untouched.
    expect(zxx.upperAlphabet[0]).toBe('+');
    expect(zxx.upperAlphabet.indexOf('A')).toBe(1);
  });

  it('upperAlphabet rejects push/pop too', () => {
    expect(() => { (zxx.upperAlphabet as string[]).push('!'); }).toThrow(TypeError);
    expect(() => { (zxx.upperAlphabet as string[]).pop(); }).toThrow(TypeError);
  });
});

describe('LocaleData.fullAlphabetMask', () => {
  // Replaces the ex-`0xFFFFFFFF` bitmask accept-all. The shared array form means
  // the solver's hot-path check `if (!mask[charId]) continue` behaves identically
  // for any alphabet size, whereas `1 << charId` wraps silently at charId >= 32.
  it('has length alphabetSize with separator=0 and every real letter=1', () => {
    expect(zxx.fullAlphabetMask.length).toBe(zxx.alphabetSize);
    expect(zxx.fullAlphabetMask[0]).toBe(0); // separator slot
    for (let charId = 1; charId < zxx.alphabetSize; charId++) {
      expect(zxx.fullAlphabetMask[charId]).toBe(1);
    }
  });
});

describe('LocaleData binary shape-check', () => {
  // Helper: clone the real zxx GADDAG as a plain Uint32Array we can corrupt.
  function loadRawBinary(): Uint32Array {
    const buf = fs.readFileSync(TEST_GADDAG_PATH);
    return new Uint32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  }

  it('accepts the committed test binary', () => {
    const gaddag = loadRawBinary();
    expect(() => new LocaleData('zxx', gaddag)).not.toThrow();
  });

  // Mirrors the guard against the real failure mode: someone adds/removes a
  // letter in tile-configs.ts but forgets `bun run compress:all`, leaving the
  // binary stale. Without the shape-check, every move from the solver is
  // silently wrong (char_ids are shifted). With it, construction throws.
  it('throws when the binary root has fewer letters than the alphabet expects', () => {
    const gaddag = loadRawBinary();
    // Walk root siblings to find the last one (no hasMoreSiblings bit), then
    // clear that bit on an EARLIER sibling to truncate the chain.
    let idx = 1;
    const firstIdx = idx;
    while (gaddag[idx] & 0x1000000) idx++; // find last sibling
    // Truncate by clearing hasMoreSiblings on the first sibling — the chain
    // now has exactly one entry, but the alphabet expects 26.
    gaddag[firstIdx] = gaddag[firstIdx] & ~0x1000000;
    expect(() => new LocaleData('zxx', gaddag)).toThrow(/alphabet mismatch|compress:all/i);
  });

  it('throws when the reserved sentinel at index 0 is missing', () => {
    const gaddag = loadRawBinary();
    gaddag[0] = 42; // any non-zero value signals an older/foreign binary layout
    expect(() => new LocaleData('zxx', gaddag)).toThrow(/sentinel|older format/i);
  });

  it('throws when the binary is too short to even hold the sentinel + one child', () => {
    expect(() => new LocaleData('zxx', new Uint32Array([0]))).toThrow(/too short/i);
    expect(() => new LocaleData('zxx', new Uint32Array([]))).toThrow(/too short/i);
  });

  // Guards the loop cap + oversize detection: a hand-built binary with 49
  // distinct root char_ids should not hang construction — the cap fires at
  // alphabetSize+1 iterations and the mismatch assertion surfaces the bug.
  it('throws cleanly on a binary with too many distinct root char_ids', () => {
    const gaddag = new Uint32Array(100);
    gaddag[0] = 0; // sentinel
    // 49 distinct char_ids with hasMoreSiblings=1, then one terminator.
    for (let i = 1; i < 50; i++) {
      gaddag[i] = (i << 26) | 0x1000000;
    }
    gaddag[50] = 50 << 26; // terminator
    expect(() => new LocaleData('zxx', gaddag)).toThrow(/alphabet mismatch/i);
  });
});
