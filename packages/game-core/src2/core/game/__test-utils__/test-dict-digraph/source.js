// Synthetic dictionary exercising multi-character tiles. Not a real language —
// this dict's whole purpose is to stress the digraph/trigraph code paths:
//   - CH (2 UTF-16 code units, 2 chars)
//   - LL (2 units)
//   - L·L (3 units: L + middle dot U+00B7 + L — Catalan-style trigraph)
// Tile set combines all 26 latin uppercase letters + those three digraphes.
// Greedy longest-match tokenization means "CHAT" → [CH, A, T] (not C+H+A+T).
function om(o) { let m = new Map(), k = Object.keys(o); for (let i = k.length - 1; i >= 0; --i) m.set(k[i], o[k[i]]); return m; };
export default om({
  // 2-letter (cross-word fodder + short openers)
  "AA": "-", "AS": "-", "AT": "-", "BA": "-", "BE": "-",
  "CA": "-", "CE": "-", "DE": "-", "EN": "-", "ES": "-",
  "ET": "-", "HE": "-", "LA": "-", "LE": "-", "NA": "-",
  "NE": "-", "OA": "-", "OE": "-", "ON": "-", "TA": "-",
  "TE": "-", "TO": "-",
  // Digraph in isolation
  "CH": "-", "LL": "-",
  // Digraph at start
  "CHAT": "-", "CHAS": "-", "CHALE": "-",
  // Digraph in middle
  "ACHAT": "-",
  // Digraph at end
  "ACH": "-", "BALL": "-",
  // Trigraph (Catalan-style punt volat)
  "L·L": "-", "L·LA": "-", "AL·L": "-",
  // A greedy-tokenization sanity-check word: greedy picks CH over C+H,
  // so "CHE" → [CH, E] and needs only those 2 tiles in the rack.
  "CHE": "-",
  // A plain-LL word to distinguish LL tile from two separate L tiles when
  // they cross with digraph words.
  "BALLE": "-",
});
