import fs from 'fs';

let data, uint32Data;
try {
  data = fs.readFileSync('dictionary-pl.bin');
  uint32Data = new Uint32Array(
    data.buffer,
    data.byteOffset,
    data.length / Uint32Array.BYTES_PER_ELEMENT
  );
} catch (err) {
  console.error('Error while reading dictionary: ', err);
  process.exit(0);
}

interface Node {
  id: number;
  endOfWord: boolean;
  hasMoreSiblings: boolean;
  children: Node[];
  childrenCount: number;
  firstChildIndex: number;
}

const { alphabet: ALPHABET, words: DB } = extractAllWords(uint32Data);

const EMPTY = ' ';
const SEPARATOR = '+';
const GADDAG_ALPHABET = (EMPTY + ALPHABET.join('') + SEPARATOR).split('');
const TO_GADDAG_ALPHABET = GADDAG_ALPHABET.reduce((map, c, id) => {
  map.set(c, id);
  return map;
}, new Map());

const CHARCODE_TO_ID = new Array(65536);
for (const [char, id] of TO_GADDAG_ALPHABET) {
  CHARCODE_TO_ID[char.charCodeAt(0)] = id;
}

const SEPARATOR_ID = TO_GADDAG_ALPHABET.get(SEPARATOR);
const EMPTY_ID = TO_GADDAG_ALPHABET.get(EMPTY);


/**
 * Extract all compressed DAWG words
 */
function extractAllWords(data: Uint32Array): { alphabet: string[], words: string[] } {
  // Extract alphabet from header
  const alphabetLen = data[0];
  const alphabet: string[] = new Array(alphabetLen);
  for (let i = 0; i < alphabetLen; i++) {
    alphabet[i] = String.fromCharCode(data[i + 1]);
  }
  let rootIndex = alphabetLen * 2 + 2;

  const words: string[] = [];
  // Pile [current index, current word]
  const stack: Array<number | string> = [];

  // Init
  if (data.length > 0) stack.push(rootIndex, '');

  while (stack.length > 0) {
    const currentWord = stack.pop() as string;
    const currentIndex = stack.pop() as number;
    // if (currentIndex >= data.length) continue;

    const nodeVal = data[currentIndex];
    const childPointer = nodeVal & 0xFFFFFF;
    const char = alphabet[(nodeVal >>> 26) & 0x3F]; // charId = (nodeVal >>> 26) & 0x3F
    if (!char) continue;

    const newWord = currentWord + char;

    // End of word = (nodeVal >>> 25) & 0x1
    if (((nodeVal >>> 25) & 0x1) === 1) words.push(newWord);
    // hasMore = (nodeVal >>> 24) & 0x1
    if (((nodeVal >>> 24) & 0x1) && currentIndex + 1 < data.length) stack.push(currentIndex + 1, currentWord);
    // children
    if (childPointer !== 0 && childPointer < data.length) stack.push(childPointer, newWord);
  }
  return { alphabet, words };
}



const root = {
  id: 0,
  endOfWord: false,
  hasMoreSiblings: false,
  children: new Array(GADDAG_ALPHABET.length),
  childrenCount: 0,
  firstChildIndex: 0
};


/**
 * PASS 1: Build the GADDAG tree
 * For a word like "CARE", we insert:
 * C+ARE, AC+RE, RAC+E, ERAC+
 */
function onEachGaddagChar(str: string, len: number, splitAt: number, onEachChar: (charId: number) => void) {
  // Reverse the prefix and add the separator
  for (let i = splitAt - 1; i >= 0; i--) {
    onEachChar(CHARCODE_TO_ID[str.charCodeAt(i)]);
  }
  onEachChar(SEPARATOR_ID);
  for (let i = splitAt; i < len; i++) {
    onEachChar(CHARCODE_TO_ID[str.charCodeAt(i)]);
  }
}

function insertGaddagPath(str: string, len: number, splitAt: number) {
  let current = root;
  onEachGaddagChar(str, len, splitAt, (charId: number) => {
    let next = current.children[charId];
    if (!next) {
      current.children[charId] = next = {
        id: 0,
        endOfWord: false,
        hasMoreSiblings: false,
        children: new Array(GADDAG_ALPHABET.length),
        childrenCount: 0,
        firstChildIndex: 0
      };
      current.childrenCount++;
    }
    current = next;
  });
  current.endOfWord = true;
}

// Generate all pivoted paths for each word in your DB
console.time('gaddagpath');
DB.forEach(word => {
  for (let i = 1, len = word.length; i <= len; i++) {
    insertGaddagPath(word, len, i);
  }
})
console.timeEnd('gaddagpath');


// PASS 2: minification
/**
 * Generates a unique signature for a node based on its properties 
 * and its children's identities to allow sharing identical branches.
 */

const nodesBySignature = new Map<string, Node>();

function getSignature(charId: number, current: Node) {
  let sig = charId + (current.endOfWord ? '!' : '?');

  if (current.childrenCount) {
    const children = current.children;
    for (let charId = children.length - 1; charId >= 0; charId--) {
      if (children[charId]) {
        children[charId] = minify(charId, children[charId]);
        sig += GADDAG_ALPHABET[charId] + children[charId].id;
      }
    }
  }
  return sig;
}

/**
 * Bottom-up reduction of the Trie into a DAWG.
 * Replaces nodes with existing identical structures.
 */
let idIndex = 0;
function minify(charId: number, current: Node): Node {
  const sig = getSignature(charId, current);
  const existing = nodesBySignature.get(sig);

  if (existing) return existing;

  // Assign a unique ID to the new unique structure
  current.id = idIndex++;
  nodesBySignature.set(sig, current);
  return current;
}
console.time('minify');
const minifiedRoot = minify(0, root);
// Safety check for your 24-bit pointer
if (nodesBySignature.size >= 0xFFFFFF) {
  throw new Error("GADDAG is too large for 24-bit addressing");
}
console.timeEnd('minify');

// PASS 3: Flatten the DAWG
/**
 * Serializes the DAWG into a Uint32Array.
 * Nodes are packed into 32-bit integers.
 */
function buildUint32Array(root: Node): Uint32Array {
  const nodeToIndex = new Map<number, number>();
  const buffer: number[] = [];

  function serialize(n: Node): number {
    const cachedIndex = nodeToIndex.get(n.id);
    if (cachedIndex !== undefined) return cachedIndex;

    const firstChildIndex = buffer.length;
    let count = n.childrenCount;

    // No children => return 0
    if (count === 0) {
      nodeToIndex.set(n.id, 0);
      return 0;
    }

    for (let i = 0; i < count; i++) {
      buffer.push(0);
    }

    let i = 0;
    for (let charId = 0, len = n.children.length, child; charId < len; charId++) {
      if ((child = n.children[charId])) {

        const childPointer = serialize(child);
        const hasMore = i < count - 1 ? 1 : 0;
        const eow = child.endOfWord ? 1 : 0;

        // Binary layout: [charId: 6b] [eow: 1b] [hasMore: 1b] [pointer: 24b]
        // charId: shift by 26 (24+1+1)
        // eow: shift by 25 (24+1)
        // hasMore: shift by 24
        // pointer: 24 bits (0xFFFFFF)
        const val = (charId << 26) | (eow << 25) | (hasMore << 24) | (childPointer & 0xFFFFFF);
        buffer[firstChildIndex + i] = val >>> 0;

        i++;
      }
    }
    nodeToIndex.set(n.id, firstChildIndex);
    return firstChildIndex;
  }

  // Start serialization from the root's children
  serialize(root);
  return new Uint32Array(buffer);
}
console.time('buildUint32Array');
const dawgArray = buildUint32Array(minifiedRoot);
console.timeEnd('buildUint32Array');


await Bun.write("gaddag-dictionary.bin", new Uint8Array(dawgArray.buffer));

/**
 * Checks if a word exists in the compressed Uint32Array.
 */
function contains(data: Uint32Array, word: string): boolean {
  // We look for the path: word[0] -> '+' -> word[1] -> word[2]...
  word = word.charAt(0) + SEPARATOR + word.slice(1);

  let currentIndex = data[0] * 2 + 2;
  const wordLen = word.length;

  for (let i = 0; i < wordLen; i++) {
    const targetCharId = TO_GADDAG_ALPHABET.get(word.charAt(i));
    let found = false;

    while (true) {
      const nodeVal = data[currentIndex];
      const charId = (nodeVal >>> 26) & 0x3F;
      const hasMore = (nodeVal >>> 24) & 0x1;

      if (charId === targetCharId) {
        // If it's the last character, check the endOfWord bit
        if (i === wordLen - 1) return ((nodeVal >>> 25) & 0x1) === 1;

        // Move to the child's index for the next character
        currentIndex = nodeVal & 0xFFFFFF;
        found = true;
        break;
      }

      // If not the right character and no more siblings, word not found
      if (!hasMore) return false;
      currentIndex++;
    }

    if (!found) return false;
  }
  return false;
}

// console.time('unfound')
// const unfound = DB.find((word: string) => !contains(dawgArray, word));
// console.timeEnd('unfound')

// console.log("Is Dictionary complete: " + (unfound ? "no" : "yes"));
// console.log(contains(dawgArray, "MARCHE"));
// console.log(contains(dawgArray, "PROCHE"));
// console.log(contains(dawgArray, "ZXYZY"));

