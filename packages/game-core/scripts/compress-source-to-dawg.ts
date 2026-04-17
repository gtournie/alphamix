/**
 * Compresses dictionary source files (data/dictionaries/dict-{locale}.js)
 * into DAWG binary files (data/dictionaries-dawg/{locale}.bin).
 *
 * Only compresses dictionaries that don't already have a .bin output.
 *
 * Usage: bun run scripts/compress-to-dawg.ts
 */

import fs from 'fs';
import path from 'path';

const DICTIONARIES_DIR = path.resolve(import.meta.dir, '../dictionaries/source');
const OUTPUT_DIR = path.resolve(import.meta.dir, '../dictionaries/dawg');

// --- DAWG compression logic ---

interface Node {
  id: number;
  endOfWord: boolean;
  hasMoreSiblings: boolean;
  children: Node[];
  childrenCount: number;
  firstChildIndex: number;
}

function compressToDawg(words: string[], locale: string): Uint32Array {
  const SEPARATOR = '+';
  const ALPHABET_SET = new Set<string>();
  for (const word of words) {
    for (let i = 0, len = word.length; i < len; i++) {
      ALPHABET_SET.add(word.charAt(i));
    }
  }
  const ALPHABET = [SEPARATOR, ...[...ALPHABET_SET.keys()].sort((a, b) => a.localeCompare(b, locale, { sensitivity: 'base' }))];

  const ALPHABET_CODE_TO_CHAR_ID = new Array(65536);
  ALPHABET.forEach((c, index) => { ALPHABET_CODE_TO_CHAR_ID[c.charCodeAt(0)] = index; });

  // PASS 1: Build the trie
  let totalGaddagNodes = 1;

  const root: Node = {
    id: 0,
    endOfWord: false,
    hasMoreSiblings: false,
    children: new Array(ALPHABET.length),
    childrenCount: 0,
    firstChildIndex: 0
  };

  console.time('  build trie');
  for (const word of words) {
    const len = word.length;
    totalGaddagNodes += len * (len + 1);
    let current = root;

    for (let i = 0; i < len; i++) {
      const charId = ALPHABET_CODE_TO_CHAR_ID[word.charCodeAt(i)];
      let next = current.children[charId];
      if (!next) {
        current.children[charId] = next = {
          id: 0,
          endOfWord: false,
          hasMoreSiblings: false,
          children: new Array(ALPHABET.length),
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
          sig += ALPHABET[cId] + children[cId].id;
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
  if (nodesBySignature.size >= 0xFFFFFF) {
    throw new Error("DAWG is too large for 24-bit addressing");
  }
  console.timeEnd('  minify');

  // PASS 3: Flatten into Uint32Array
  function buildUint32Array(root: Node, alphabet: string[]): Uint32Array {
    const nodeToIndex = new Map<number, number>();
    const buffer: number[] = [];

    // Header: alphabet length, then alphabet chars, then totalGaddagNodes estimate
    const alphabetLen = alphabet.length;
    buffer.push(alphabetLen);
    for (let i = 0; i < alphabetLen; i++) {
      buffer.push(ALPHABET[i].charCodeAt(0));
    }
    buffer.push(totalGaddagNodes);

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

  const dawgArray = buildUint32Array(minifiedRoot, ALPHABET);

  // Verification: check a few words
  console.time('  verify');
  function contains(data: Uint32Array, word: string): boolean {
    let currentIndex = data[0] + 2; // Skip alphabet and totalGaddagNodes
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

  const unfound = words.find(word => !contains(dawgArray, word));
  console.timeEnd('  verify');

  if (unfound) {
    throw new Error(`Verification failed: word "${unfound}" not found in DAWG`);
  }
  console.log(`  Dictionary complete: ${words.length} words verified`);

  return dawgArray;
}

// --- Main ---

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // List {locale}.js files
  const files = fs.readdirSync(DICTIONARIES_DIR)
    .filter(f => f.match(/^(.+)\.js$/));

  if (files.length === 0) {
    console.log('No dictionary files found in', DICTIONARIES_DIR);
    return;
  }

  for (const file of files) {
    const locale = file.match(/^(.+)\.js$/)![1];
    const outputPath = path.join(OUTPUT_DIR, `${locale}.bin`);

    if (fs.existsSync(outputPath)) {
      console.log(`[${locale}] Already compressed, skipping`);
      continue;
    }

    console.log(`[${locale}] Compressing ${file}...`);

    // Import the dictionary (default export is a Map<string, string>)
    const dictModule = await import(path.join(DICTIONARIES_DIR, file));
    const dict: Map<string, string> = dictModule.default;

    // Extract words (keys), uppercase them for the locale
    const words = [...dict.keys()].map(w => w.toLocaleUpperCase(locale));

    console.log(`  ${words.length} words loaded`);

    const dawgArray = compressToDawg(words, locale);
    await Bun.write(outputPath, new Uint8Array(dawgArray.buffer));

    const sizeKB = (dawgArray.byteLength / 1024).toFixed(1);
    console.log(`  Written ${outputPath} (${sizeKB} KB)`);
  }

  console.log('\nDone.');
}

main();
