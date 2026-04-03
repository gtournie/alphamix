export function objectToMap<T>(obj: Record<string, T>): Map<string, T> {
  let map = new Map();
  let keys = Object.keys(obj);
  for (let i = keys.length - 1; i >= 0; --i) {
    map.set(keys[i], obj[keys[i]]);
  }
  return map;
}

export function objectToSet(obj: Record<string, unknown>): Set<string> {
  return new Set(Object.keys(obj));
}





