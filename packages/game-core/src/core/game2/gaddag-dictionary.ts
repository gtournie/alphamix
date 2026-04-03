import DB from '../../../data/1mot';

const codeLang = "fr"; // TODO

console.time('build alphabet')
let ALPHABET_SET = new Set<string>();
[...DB.keys()].forEach(word => {
  for (let i = 0, len = word.length; i < len; i++) {
    const c = word.charAt(i);
    if (!ALPHABET_SET.has(c)) ALPHABET_SET.add(c);
  }
});
const ALPHABET = [...ALPHABET_SET.keys()].sort((a: string, b: string) => a.localeCompare(b, codeLang, { sensitivity: 'base' }));
console.timeEnd('build alphabet')


const EMPTY = ' ';
const SEPARATOR = '+';
const GADDAG_ALPHABET = (EMPTY + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + SEPARATOR).split('');
const TO_GADDAG_ALPHABET = GADDAG_ALPHABET.reduce((map, c, index) => {
  map.set(c, index);
  return map;
}, new Map());

const SEPARATOR_ID = TO_GADDAG_ALPHABET.get(SEPARATOR);
const EMPTY_ID = TO_GADDAG_ALPHABET.get(EMPTY);

interface Node {
  id: number;
  endOfWord: boolean;
  hasMoreSiblings: boolean;
  children: Node[];
  childrenCount: number;
  firstChildIndex: number;
}


/**
 * PASS 1: Build the GADDAG tree
 * For a word like "CARE", we insert:
 * C+ARE, AC+RE, RAC+E, ERAC+
 */
const root = {
  id: 0,
  endOfWord: false,
  hasMoreSiblings: false,
  children: new Array(GADDAG_ALPHABET.length),
  childrenCount: 0,
  firstChildIndex: 0
};

// function insertGaddagPath(path: string) {
//   let current = root;
//   const len = path.length;
//   for (let i = 0; i < len; i++) {
//     const charId = TO_GADDAG_ALPHABET.get(path.charAt(i));
//     let next = current.children.get(charId);
//     if (!next) {
//       next = node(charId);
//       current.children.set(charId, next);
//     }
//     current = next;
//   }
//   current.endOfWord = true;
// }

// const SEPARATOR_CODE = SEPARATOR.charCodeAt(0);
// function gaddagString(str: string, len: number, splitAt: number) {
//   const reverseCodes = new Array(len + 1);
//   for (let i = 0; i < splitAt; i++) {
//     reverseCodes[splitAt - i - 1] = str.charCodeAt(i);
//   }
//   reverseCodes[splitAt] = SEPARATOR_CODE;
//   for (let i = splitAt; i < len; i++) {
//     reverseCodes[i + 1] = str.charCodeAt(i);
//   }
//   return String.fromCharCode(...reverseCodes);
// }

const CHARCODE_TO_ID = new Array(65536);
for (const [char, id] of TO_GADDAG_ALPHABET) {
  CHARCODE_TO_ID[char.charCodeAt(0)] = id;
}

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

// We need perf here, so duplicate code is ok
// function insertGaddagPath2(str: string, len: number, splitAt: number) {
//   let current = root;

//   // Précalculer tous les charIds en une seule passe
//   const charIds = new Array(len);
//   for (let i = 0; i < len; i++) {
//     charIds[i] = TO_GADDAG_ALPHABET.get(str.charAt(i));
//   }

//   // Reverse prefix
//   for (let i = splitAt - 1; i >= 0; i--) {
//     const charId = charIds[i];
//     let next = current.children[charId];
//     if (!next) {
//       current.children[charId] = next = node(charId);
//       current.childrenCount++;
//     }
//     current = next;
//   }

//   // Separator
//   let next = current.children[SEPARATOR_ID];
//   if (!next) {
//     current.children[SEPARATOR_ID] = next = node(SEPARATOR_ID);
//     current.childrenCount++;
//   }
//   current = next;

//   // Rest
//   for (let i = splitAt; i < len; i++) {
//     const charId = charIds[i];
//     let next = current.children[charId];
//     if (!next) {
//       current.children[charId] = next = node(charId);
//       current.childrenCount++;
//     }
//     current = next;
//   }
//   current.endOfWord = true;
// }

// Generate all pivoted paths for each word in your DB
console.time('gaddagpath');
for (const word of DB.keys()) {
  for (let i = 1, len = word.length; i <= len; i++) {
    insertGaddagPath(word, len, i);
  }
}
console.timeEnd('gaddagpath');

// // PASS 2: sorting all children
// function filterChildren(current: Node) {
//   if (!current.childrenCount) return current.children = [];

//   const children = new Array(current.childrenCount);
//   let i = 0;
//   for (let charId = 0, len = current.children.length, child; charId < len; charId++) {
//     if ((child = current.children[charId])) {
//       children[i++] = child;
//       filterChildren(child);
//     }
//   }
//   current.children = children;
//   children.forEach(filterChildren);
// }
// console.time('filter children')
// filterChildren(root);
// console.timeEnd('filter children')

// PASS 2: minification
/**
 * Generates a unique signature for a node based on its properties 
 * and its children's identities to allow sharing identical branches.
 */
// function getSignature(node: Node): string {
//   // Use charId and endOfWord status as part of the key
//   let sig = `${node.charId},${+node.endOfWord}`;

//   if (node.childrenCount) {
//     for (let charId = 0, len = node.children.length, child; charId < len; charId++) {
//       if ((child = node.children[charId])) {
//         sig += `|${charId}:${child.id}`;
//       }
//     }
//   }

//   // const childKeys = [...node.children.keys()].sort((a, b) => a - b);

//   // // Append each child's unique ID to the signature
//   // for (let i = 0, len = childKeys.length; i < len; i++) {
//   //   const charId = childKeys[i];
//   //   const child = node.children.get(charId)!;
//   //   sig += `|${charId}:${child.id}`;
//   // }
//   return sig;
// }

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

    // const childKeys = Array.from(n.children.keys()).sort((a, b) => a - b);
    // const len = n.children.length;

    // // Si le nœud n'a pas d'enfants, retourner 0
    // if (len === 0) {
    //   nodeToIndex.set(n.id, 0);
    //   return 0;
    // }

    // // Pre-allocate space for siblings to ensure contiguity
    // for (let i = 0; i < len; i++) {
    //   buffer.push(0);
    // }

    // for (let i = 0; i < len; i++) {
    //   const charId = childKeys[i];
    //   const child = n.children.get(charId)!;
    //   // Recursively serialize children to get their pointer
    //   const childPointer = serialize(child);

    //   const hasMore = i < len - 1 ? 1 : 0;
    //   const eow = child.endOfWord ? 1 : 0;

    //   // Binary layout: [charId: 6b] [eow: 1b] [hasMore: 1b] [pointer: 24b]
    //   // charId: shift by 26 (24+1+1)
    //   // eow: shift by 25 (24+1)
    //   // hasMore: shift by 24
    //   // pointer: 24 bits (0xFFFFFF)
    //   const val = (charId << 26) | (eow << 25) | (hasMore << 24) | (childPointer & 0xFFFFFF);
    //   buffer[firstChildIndex + i] = val >>> 0;
    // }

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
function contains(data: Uint32Array, word: string, rootIndex: number = 0): boolean {
  // We look for the path: word[0] -> '+' -> word[1] -> word[2]...
  word = word.charAt(0) + SEPARATOR + word.slice(1);

  let currentIndex = rootIndex;
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

console.time('unfound')
const unfound = [...DB.keys()].find((word: string) => !contains(dawgArray, word));
console.timeEnd('unfound')

console.log("Is Dictionary complete: " + (unfound ? "no" : "yes"));
console.log(contains(dawgArray, "MARCHE"));
console.log(contains(dawgArray, "PROCHE"));
console.log(contains(dawgArray, "ZXYZY"));


// function onAnchors(grid: number[][], x: number, y: number, func: (x: number, y: number) => void, cache: boolean[] = new Array(15 * 15)) {
//   const key = x * 15 + y;
//   if (cache[key]) return;

//   cache[key] = true;
//   if (grid[x][y] === EMPTY_ID) {
//     func(x, y);
//     return;
//   }

//   if (x > 0) onAnchors(grid, x - 1, y, func, cache);
//   if (x < 14) onAnchors(grid, x + 1, y, func, cache);
//   if (y > 0) onAnchors(grid, x, y - 1, func, cache);
//   if (y < 14) onAnchors(grid, x, y + 1, func, cache);
// }


// const grid = [
//   // 012345678901234
//   "               ", // 0
//   "               ", // 1
//   "               ", // 2
//   "               ", // 3
//   "               ", // 4
//   "               ", // 5
//   "               ", // 6
//   "    MAISON     ", // 7
//   "               ", // 8
//   "               ", // 9
//   "               ", // 10
//   "               ", // 11
//   "               ", // 12
//   "               ", // 13
//   "               ", // 14
// ].map(line => line.split(''));

// const nGrid = Array.from({ length: 15 }, () => new Array(15).fill(0));
// for (let x = 0; x < 15; x++) {
//   for (let y = 0; y < 15; y++) {
//     nGrid[x][y] = TO_ALPHABET.get(grid[x][y]);
//   }
// }

// // for (let x = 0; x < 15; ++x) console.log(nGrid[x].join(''));

// onAnchors(nGrid, 7, 7, (x, y) => grid[x][y] = '.');

// for (let x = 0; x < 15; ++x) console.log(grid[x].join(''));