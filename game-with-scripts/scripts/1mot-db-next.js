import fs from 'fs';
import { join, dirname } from 'path';
import objectToMapSource from './object-to-map-source.js';
import { fileURLToPath } from 'url';
import db from '../../packages/game-core/data/1mot.js';
const __dirname = dirname(fileURLToPath(import.meta.url));

const DIR = join(__dirname, '..', 'data');

// TODO: move to lib
function sortAsciiString(str, str2 = '') {
  const sortedCodes = [];
  for (let i = 0, len = str2.length; i < len; ++i) {
    sortedCodes.push(str2.charCodeAt(i));
  }
  for (let i = str.length - 1, j; i >= 0; --i) {
    let currentCode = str.charCodeAt(i);
    for (j = sortedCodes.length - 1; j >= 0 && sortedCodes[j] > currentCode; --j) {
      sortedCodes[j + 1] = sortedCodes[j];
    }
    sortedCodes[j + 1] = currentCode;
  }
  return String.fromCharCode(...sortedCodes);
}

class MapJSON extends Map {
  toJSON() {
    let obj = Object.fromEntries(this);
    return Object.keys(obj).sort((a, b) => a > b ? 1 : -1).reduce((h, k) => (h[k] = obj[k], h), {});
  }
}

class MapArray extends MapJSON {
  set(key, value) {
    if (super.has(key)) {
      return super.get(key).push(value);
    }
    return super.set(key, [value]);
  }
}

const WORDS_BY_LENGTH = new MapArray();
const SUBSET_OF = new MapJSON();
const WORDS_BY_SORTED_LETTERS = new MapArray();

let t = 0;
console.time('total')
console.time('t' + t)
let dbKeys = Object.keys(db).sort((a, b) => a.length - b.length);
for (let i = dbKeys.length - 1; i >= 0; --i) {
  let word = dbKeys[i];
  WORDS_BY_LENGTH.set(word.length, word);
  WORDS_BY_SORTED_LETTERS.set(sortAsciiString(word), word);
}
console.timeEnd('t' + t++)

let content = "function om(o) { let m = new Map(), k = Object.keys(o); for (let i = k.length - 1; i >= 0; --i) m.set(k[i], o[k[i]]); return m; };\n";

fs.writeFileSync(join(DIR, 'words-by-sorted-letters-map.js'), content + "export default om(" + JSON.stringify(WORDS_BY_SORTED_LETTERS, null, 2) + ")");

// console.time('t' + t)
// const lengths = Array.from(WORDS_BY_LENGTH.keys()).sort((a, b) => a - b);
// let words = lengths.flatMap(length => WORDS_BY_LENGTH.get(length));
// let currentLength = lengths.shift();
// let shortWordsCache = lengths.flatMap(length => WORDS_BY_LENGTH.get(length));

// process.stdout.write('' + currentLength + ':' + WORDS_BY_LENGTH.get(currentLength).length * shortWordsCache.length + ' ')
// for (let j = 0, len = words.length; j < len; ++j) {
//   const word = words[j];
//   SUBSET_OF.set(word, []);

//   if (word.length > currentLength) {
//     lengths.shift();
//     shortWordsCache = lengths.flatMap(length => WORDS_BY_LENGTH.get(length));
//     currentLength = word.length;
//     console.timeEnd('t' + t++)
//     console.time('t' + t)
//     process.stdout.write(currentLength + ':' + WORDS_BY_LENGTH.get(currentLength).length * shortWordsCache.length + ' ')
//   }

//   // Start searching from longer words
//   for (let i = shortWordsCache.length - 1; i >= 0; --i) {
//     const otherWord = shortWordsCache[i];
//     if (otherWord.includes(word)) {
//       SUBSET_OF.get(word).push(otherWord);
//     }
//   }
// }
// console.timeEnd('t' + t++)
// fs.writeFileSync(join(DIR, 'words-subset-of.json'), JSON.stringify(SUBSET_OF, null, 2));

// console.time('t' + t)
// const WORDS_INFOS = new MapJSON();
// for (let [word, subset] of SUBSET_OF) {
//   let maxCharBefore = 0;
//   let maxCharAfter = 0;
//   for (let i = subset.length - 1; i >= 0; --i) {
//     let s = subset[i];
//     let index = s.indexOf(word);
//     maxCharBefore = Math.max(maxCharBefore, index);
//     maxCharAfter = Math.max(maxCharAfter, s.length - (index + word.length));
//   }
//   WORDS_INFOS.set(word, {
//     definition: db[word],
//     asPrefixOnly: maxCharBefore === 0, 
//     asSuffixOnly: maxCharAfter === 0,
//     maxCharBefore,
//     maxCharAfter,
//   })
// }
// console.timeEnd('t' + t++)
// console.timeEnd('total')
// fs.writeFileSync(join(DIR, 'words.json'), JSON.stringify(WORDS_INFOS, null, 2));
