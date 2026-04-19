/**
 * Compresses dictionary source files (dictionaries/source/{locale}.js)
 * into DAWG binary files (dictionaries/dawg/{locale}.bin).
 *
 * Only compresses dictionaries that don't already have a .bin output — pass
 * `--force` to rebuild existing ones (mandatory whenever the binary layout
 * changes; otherwise a stale binary keeps shipping silently).
 *
 * When the alphabet itself changes (edits to TILE_INFO_BY_LOCALES, added/removed
 * letters), DAWG *and* GADDAG must be regenerated as a pair — otherwise char_ids
 * drift between them. Run `bun run compress:all` in that case; LocaleData's
 * shape-check at load will throw a clear error if only one side was rebuilt.
 *
 * Binary layout: [estimatedGaddagNodes, ...nodes]
 *   - [0]  : upper bound on GADDAG nodes (used to size the WASM arena during conversion)
 *   - [1..]: DAWG nodes, starting with the root's first-child sibling chain
 *
 * The alphabet is NOT stored in the file — both compression and runtime derive it
 * from TILE_INFO_BY_LOCALES[locale].ID_TO_CHAR, which is the single source of truth.
 *
 * Usage: bun run scripts/compress-source-to-dawg.ts [--force]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TILE_INFO_BY_LOCALES } from '../src2/core/game/locale/tile-configs';

// `import.meta.dir` is Bun-only; under Vitest (Node) this script is imported
// just for `compressToDawg`, and top-level `import.meta.dir` resolves to
// `undefined`, which crashes `path.resolve`. The URL-based derivation works
// in both runtimes, so tests that import this module don't explode at load.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DICTIONARIES_DIR = path.resolve(HERE, '../dictionaries/source');
const OUTPUT_DIR = path.resolve(HERE, '../dictionaries/dawg');

interface Node {
  id: number;
  endOfWord: boolean;
  hasMoreSiblings: boolean;
  children: Node[];
  childrenCount: number;
  firstChildIndex: number;
}

/**
 * Walks the DAWG buffer produced by `compressToDawg` to check membership of a
 * single word. Exported so the buggy paths can be tested directly.
 *
 * Root's sibling chain starts at index 1 (index 0 is the estimatedGaddagNodes
 * header word). A node's child pointer is stored in the low 24 bits; leaves
 * serialize with pointer = 0. When the query still has letters left to walk
 * but we've matched a leaf, the word isn't in the dict — returning false
 * early here prevents the subsequent iteration from reading `data[0]` (the
 * header) and misinterpreting its bits as a node.
 */
export function dawgContains(
  data: Uint32Array,
  charToId: ReadonlyMap<string, number>,
  word: string
): boolean {
  let currentIndex = 1;
  const wordLen = word.length;

  for (let i = 0; i < wordLen; i++) {
    const targetCharId = charToId.get(word.charAt(i));
    if (targetCharId === undefined) return false;

    while (true) {
      const nodeVal = data[currentIndex];
      const charId = (nodeVal >>> 26) & 0x3F;
      const hasMore = (nodeVal >>> 24) & 0x1;

      if (charId === targetCharId) {
        if (i === wordLen - 1) return ((nodeVal >>> 25) & 0x1) === 1;
        const nextIndex = nodeVal & 0xFFFFFF;
        if (nextIndex === 0) return false; // leaf — no longer word shares this prefix
        currentIndex = nextIndex;
        break;
      }
      if (!hasMore) return false;
      currentIndex++;
    }
  }
  return false; // only reachable for the empty string
}

/**
 * Produces a DAWG binary with layout `[estimatedGaddagNodes, ...nodes]`.
 *
 * Child pointers inside DAWG nodes are absolute indices into this full buffer
 * (position 0 = estimatedGaddagNodes header word; root's first child lives at
 * index 1). Downstream consumers — notably the WASM converter — rely on this
 * layout, so the buffer must never be sliced before being passed along.
 */
export function compressToDawg(words: string[], locale: string): Uint32Array {
  const tileInfo = TILE_INFO_BY_LOCALES[locale];
  if (!tileInfo) throw new Error(`No TILE_INFO for locale "${locale}"`);
  const ID_TO_CHAR = tileInfo.ID_TO_CHAR;
  const CHAR_TO_ID = tileInfo.CHAR_TO_ID;
  const alphabetLen = ID_TO_CHAR.length;

  // PASS 1: Build the trie
  let estimatedGaddagNodes = 1;

  const root: Node = {
    id: 0,
    endOfWord: false,
    hasMoreSiblings: false,
    children: new Array(alphabetLen),
    childrenCount: 0,
    firstChildIndex: 0
  };

  console.time('  build trie');
  for (const word of words) {
    const len = word.length;
    estimatedGaddagNodes += len * (len + 1);
    let current = root;

    for (let i = 0; i < len; i++) {
      const charId = CHAR_TO_ID.get(word.charAt(i));
      if (charId === undefined) throw new Error(`Char "${word.charAt(i)}" in word "${word}" not in alphabet`);
      let next = current.children[charId];
      if (!next) {
        current.children[charId] = next = {
          id: 0,
          endOfWord: false,
          hasMoreSiblings: false,
          children: new Array(alphabetLen),
          childrenCount: 0,
          firstChildIndex: 0
        };
        current.childrenCount++;
      }
      current = next;
    }
    current.endOfWord = true;
  }
  console.timeEnd('  build trie');

  // PASS 2: Minification (signature-based deduplication)
  const nodesBySignature = new Map<string, Node>();
  let idIndex = 0;

  function getSignature(charId: number, current: Node): string {
    let sig = charId + (current.endOfWord ? '!' : '?');
    if (current.childrenCount) {
      const children = current.children;
      for (let cId = children.length - 1; cId >= 0; cId--) {
        if (children[cId]) {
          children[cId] = minify(cId, children[cId]);
          sig += ID_TO_CHAR[cId] + children[cId].id;
        }
      }
    }
    return sig;
  }

  function minify(charId: number, current: Node): Node {
    const sig = getSignature(charId, current);
    const existing = nodesBySignature.get(sig);
    if (existing) return existing;
    current.id = idIndex++;
    nodesBySignature.set(sig, current);
    return current;
  }

  console.time('  minify');
  const minifiedRoot = minify(0, root);
  console.timeEnd('  minify');

  // PASS 3: Flatten into Uint32Array.
  // Layout: [estimatedGaddagNodes, ...nodes]. Root's children start at index 1.
  function buildUint32Array(root: Node): Uint32Array {
    const nodeToIndex = new Map<number, number>();
    const buffer: number[] = [estimatedGaddagNodes];

    function serialize(n: Node): number {
      const cachedIndex = nodeToIndex.get(n.id);
      if (cachedIndex !== undefined) return cachedIndex;

      const firstChildIndex = buffer.length;
      let count = n.childrenCount;

      if (count === 0) {
        nodeToIndex.set(n.id, 0);
        return 0;
      }

      // Pre-allocate space for siblings
      for (let i = 0; i < count; i++) {
        buffer.push(0);
      }

      let i = 0;
      for (let charId = 0, len = n.children.length; charId < len; charId++) {
        const child = n.children[charId];
        if (child) {
          const childPointer = serialize(child);
          // Pointers are buffer indices capped at 24 bits. `& 0xFFFFFF` would
          // silently truncate anything larger, producing a DAWG whose lookups
          // wander into the wrong subtree. The earlier minify-time check on
          // `nodesBySignature.size` was off: it bounded the unique-node count,
          // but the pointer is a buffer index and the buffer holds one slot
          // per sibling, so it grows faster than the unique-node count.
          if (childPointer > 0xFFFFFF) {
            throw new Error(`DAWG is too large for 24-bit addressing (pointer ${childPointer} > 0xFFFFFF)`);
          }
          const hasMore = i < count - 1 ? 1 : 0;
          const eow = child.endOfWord ? 1 : 0;
          // Binary layout: [charId: 6b] [eow: 1b] [hasMore: 1b] [pointer: 24b]
          const val = (charId << 26) | (eow << 25) | (hasMore << 24) | (childPointer & 0xFFFFFF);
          buffer[firstChildIndex + i] = val >>> 0;
          i++;
        }
      }

      nodeToIndex.set(n.id, firstChildIndex);
      return firstChildIndex;
    }

    serialize(root);
    return new Uint32Array(buffer);
  }

  const dawgArray = buildUint32Array(minifiedRoot);

  console.time('  verify');
  const unfound = words.find(word => !dawgContains(dawgArray, CHAR_TO_ID, word));
  console.timeEnd('  verify');

  if (unfound) {
    throw new Error(`Verification failed: word "${unfound}" not found in DAWG`);
  }
  console.log(`  Dictionary complete: ${words.length} words verified`);

  return dawgArray;
}

const FORCE = process.argv.includes('--force');

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(DICTIONARIES_DIR)
    .filter(f => f.match(/^(.+)\.js$/));

  if (files.length === 0) {
    console.log('No dictionary files found in', DICTIONARIES_DIR);
    return;
  }

  for (const file of files) {
    const locale = file.match(/^(.+)\.js$/)![1];
    const outputPath = path.join(OUTPUT_DIR, `${locale}.bin`);

    if (!FORCE && fs.existsSync(outputPath)) {
      console.log(`[${locale}] Already compressed, skipping (use --force to rebuild)`);
      continue;
    }

    console.log(`[${locale}] Compressing ${file}...`);

    const dictModule = await import(path.join(DICTIONARIES_DIR, file));
    const dict: Map<string, string> = dictModule.default;

    const words = [...dict.keys()].map(w => w.toLocaleUpperCase(locale));

    console.log(`  ${words.length} words loaded`);

    const dawgArray = compressToDawg(words, locale);
    await Bun.write(outputPath, new Uint8Array(dawgArray.buffer));

    const sizeKB = (dawgArray.byteLength / 1024).toFixed(1);
    console.log(`  Written ${outputPath} (${sizeKB} KB)`);
  }

  console.log('\nDone.');
}

if (import.meta.main) main();
