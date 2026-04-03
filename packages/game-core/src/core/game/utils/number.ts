const PARSE_INT_CACHE = new Map([
  ['0', 0], ['1', 1], ['2', 2], ['3', 3], ['4', 4],
  ['5', 5], ['6', 6], ['7', 7], ['8', 8], ['9', 9],
  ['A', 10], ['B', 11], ['C', 12], ['D', 13], ['E', 14]
]);

export function parseInt15(value: string): number {
  return PARSE_INT_CACHE.get(value) ?? NaN;
}