// import DB from '../../../data/1mot';
import fs from 'fs';

// Need to define codeLang as polish
// const codeLang = "fr"; // TODO
const locale = "pl";

// Need to set locale as codeLang
// This is used for sorting the alphabet
// In Node.js, we can set the locale using Intl
// But in Bun, we need to set the environment variable BUN_ICU_LOCALES
// Make sure to run the script with BUN_ICU_LOCALES=pl bun run ...
// process.env.LC_ALL = codeLang; // Not working in Bun
// process.env.LANG = codeLang; // Not working in Bun


// read slowa.txt and put each word in a Map with value true
const DB = new Map<string, true>();
const data = fs.readFileSync('slowa.txt', 'utf-8');
data.split('\n').forEach(line => {
  const word = line.trim().toLocaleUpperCase(locale);
  if (word.length > 0) {
    DB.set(word, true);
  }
});


const SEPARATOR = '+';
let ALPHABET_SET = new Set<string>();
[...DB.keys()].forEach(word => {
  for (let i = 0, len = word.length; i < len; i++) {
    const c = word.charAt(i);
    if (!ALPHABET_SET.has(c)) ALPHABET_SET.add(c);
  }
});
const ALPHABET = [SEPARATOR, ...[...ALPHABET_SET.keys()].sort((a: string, b: string) => a.localeCompare(b, locale, { sensitivity: 'base' }))];

const ALPHABET_CODE_TO_CHAR_ID = new Array(65536);
ALPHABET.forEach((c, index) => { ALPHABET_CODE_TO_CHAR_ID[c.charCodeAt(0)] = index; });



interface Node {
  id: number;
  endOfWord: boolean;
  hasMoreSiblings: boolean;
  children: Node[];
  childrenCount: number;
  firstChildIndex: number;
}

let totalGaddagNodes = 1; // 1 for root

// PASS 1: Build the tree

const root = {
  id: 0,
  endOfWord: false,
  hasMoreSiblings: false,
  children: new Array(ALPHABET.length),
  childrenCount: 0,
  firstChildIndex: 0
};


console.time('build tree');
[...DB.keys()].forEach((word: string) => {
  let current = root;
  const len = word.length;

  // A word of length L generates L paths.
  // Each path 'i' (where i is the pivot position) has a length of (L + 1).
  // Total potential nodes for this word: L * (L + 1)
  totalGaddagNodes += len * (len + 1);

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
});
console.timeEnd('build tree')
console.log(`totalGaddagNodes: ${totalGaddagNodes}`);


// PASS 2: minification
/**
 * Generates a unique signature for a node based on its properties 
 * and its children's identities to allow sharing identical branches.
 */
function getSignature(charId: number, current: Node): string {
  // Use charId and endOfWord status as part of the key
  let sig = charId + (current.endOfWord ? '!' : '?');

  if (current.childrenCount) {
    const children = current.children;
    for (let charId = children.length - 1; charId >= 0; charId--) {
      if (children[charId]) {
        children[charId] = minify(charId, children[charId]);
        sig += ALPHABET[charId] + children[charId].id;
      }
    }
  }
  return sig;
}

const nodesBySignature = new Map<string, Node>();

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
console.time('minify')
const minifiedRoot = minify(0, root);
// Safety check for your 24-bit pointer
if (nodesBySignature.size >= 0xFFFFFF) {
  throw new Error("DAWG is too large for 24-bit addressing");
}
console.timeEnd('minify')

// PASS 3: Flatten the DAWG
/**
 * Serializes the DAWG into a Uint32Array.
 * Nodes are packed into 32-bit integers.
 */
function buildUint32Array(root: Node, alphabet: string[]): Uint32Array {
  const nodeToIndex = new Map<number, number>();
  const buffer: number[] = [];

  // Header : 
  // Index 0 : alphabet length
  // Index 1..N : alphabet characters
  // Index N+1 : ESTIMATION GADDAG NODES
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

    // Si le nœud n'a pas d'enfants, retourner 0
    if (count === 0) {
      nodeToIndex.set(n.id, 0);
      return 0;
    }

    // Pre-allocate space for siblings to ensure contiguity
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
const dawgArray = buildUint32Array(minifiedRoot, ALPHABET);


await Bun.write(`dictionary-${locale}.bin`, new Uint8Array(dawgArray.buffer));

/**
 * Checks if a word exists in the compressed Uint32Array.
 */
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

/**
 * Extract all compressed DAWG words
 */
function extractAllWords(data: Uint32Array): { alphabet: string[], words: string[] } {
  // Extract alphabet from header
  const alphabetLen = data[0];
  const alphabet: string[] = [];
  for (let i = 1; i <= alphabetLen; i++) {
    alphabet.push(String.fromCharCode(data[i]));
  }
  let rootIndex = alphabetLen + 2; // skip alphabet and totalGaddagNodes

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
    const char = ALPHABET[(nodeVal >>> 26) & 0x3F]; // charId = (nodeVal >>> 26) & 0x3F
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

console.time('unfound')
const unfound = [...DB.keys()].find((word: string) => !contains(dawgArray, word));
console.timeEnd('unfound')

console.log("Is Dictionary complete: " + (unfound ? "no" : "yes"));

// Utilisation :
console.time('extract')
const extractedWords = extractAllWords(dawgArray);
console.log('ALPHABET: ', extractedWords.alphabet);
console.timeEnd('extract')

console.time('unfound2')
const set = new Set(extractedWords.words);
const unfound2 = [...DB.keys()].find((word: string) => !set.has(word));
console.timeEnd('unfound2')

console.log("Is Dictionary complete: " + (unfound2 ? "no" : "yes"));

console.log(`Nombre de mots extraits: ${extractedWords.words.length}`);
console.log(`Nombre de mots originaux: ${DB.size}`);
console.log("Extraction complète: " + (extractedWords.words.length === DB.size ? "oui" : "non"));

// Quelques exemples de mots extraits
// console.log("Premiers mots:", extractedWords.slice(0, 5));
// console.log("Derniers mots:", extractedWords.slice(-5));



