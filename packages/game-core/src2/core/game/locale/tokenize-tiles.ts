// Greedy longest-match tokenizer for words over a tile alphabet. A "tile" can
// be any string (including digraphs like "CH"/"LL" or the Catalan trigraph
// "L·L") — the caller supplies the set of legal tiles and this walks the word
// left-to-right picking the longest tile that matches at each position.
//
// Internal utility: no normalization, no uppercasing, no defensive checks.
// Callers at a data-ingestion boundary (dict source loader, TILE_INFO builder)
// are responsible for feeding NFC, uppercase input.
export function tokenizeTiles(word: string, tiles: readonly string[]): string[] {
  const out: string[] = [];
  const wlen = word.length;
  let pos = 0;
  while (pos < wlen) {
    let bestTile: string | null = null;
    let bestLen = 0;
    for (let i = 0, tlen = tiles.length; i < tlen; i++) {
      const tile = tiles[i];
      const tLen = tile.length;
      if (tLen > bestLen && pos + tLen <= wlen && word.startsWith(tile, pos)) {
        bestTile = tile;
        bestLen = tLen;
      }
    }
    if (bestTile === null) {
      throw new Error(`tokenizeTiles: no tile matches at position ${pos} in "${word}"`);
    }
    out.push(bestTile);
    pos += bestLen;
  }
  return out;
}
