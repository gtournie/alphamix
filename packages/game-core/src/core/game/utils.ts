export const parseInt15 = (() => {
  let cache = { '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14 };
  return function (value: string): number {
    return (cache as any)[value] ?? NaN;
  }
})();

/**
 * Sorts a string in ASCII order, taking into account a second string for comparison
 * @param str The string to sort
 * @param str2 Optional second string to include in the sorting
 * @returns The sorted string
 */
export function sortAsciiString(str: string, str2: string = ''): string {
  const sortedCodes: number[] = [];

  // Add codes from second string first
  for (let i = 0, len = str2.length; i < len; ++i) {
    sortedCodes.push(str2.charCodeAt(i));
  }

  // Insert codes from first string in sorted order
  for (let i = str.length - 1, j; i >= 0; --i) {
    let currentCode = str.charCodeAt(i);
    for (j = sortedCodes.length - 1; j >= 0 && sortedCodes[j] > currentCode; --j) {
      sortedCodes[j + 1] = sortedCodes[j];
    }
    sortedCodes[j + 1] = currentCode;
  }

  return String.fromCharCode(...sortedCodes);
}

/**
 * Generates combinations of characters from a string
 * @param str The input string
 * @param n The length of combinations to generate
 * @param index Optional starting index
 * @returns Array of combinations
 */
export function combinations(str: string, n: number, index?: number): string[] {
  if (str.length < n || --n < 0) return [];
  if (typeof index === 'undefined') index = 0;

  let result: string[] = [];
  for (let len = str.length; index !== len - n; ++index) {
    if (n <= 0) {
      result.push(str.charAt(index));
    } else {
      let value = str.charAt(index);
      let c = combinations(str, n, index); // let c = combinations(str, n, index + 1);
      for (let i = 0, l = c.length; i < l; ++i) {
        result.push(value + c[i]);
      }
    }
  }
  return result;
}

function om(o) { let m = new Map(), k = Object.keys(o); for (let i = k.length - 1; i >= 0; --i) m.set(k[i], o[k[i]]); return m; }

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

export function escapeRegexp(str: string) {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

export function range(from: number, to: number, inclusive = true) {
  const arr = [];
  const step = from < to ? 1 : -1;
  if (inclusive) to += step;
  for (let i = from; i !== to; i += step) arr.push(i);
  return arr;
}

