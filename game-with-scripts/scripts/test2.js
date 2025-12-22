import words from '../data/words.json' with { type: "json" }

let asPrefixOnly = 0;
let asSuffixOnly = 0;
let asPrefixAndSuffix = 0;

for (let word in words) {
  if (word.length === 15) continue;
  if (words[word].asPrefixOnly) ++asPrefixOnly;
  if (words[word].asSuffixOnly) ++asSuffixOnly;
  if (words[word].asPrefixOnly && words[word].asSuffixOnly) ++asPrefixAndSuffix;
}

console.log('asPrefixOnly', asPrefixOnly);
console.log('asSuffixOnly', asSuffixOnly);
console.log('asPrefixAndSuffix', asPrefixAndSuffix);