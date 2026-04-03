/**
 * Sorts a string in ASCII order, taking into account a second string for comparison
 * @param str The string to sort
 * @param str2 Optional second string to include in the sorting. Should already be sorted
 * @returns The sorted string
 */
export function sortAsciiString(str: string, str2: string = ''): string {
  const len1 = str.length;
  let len2 = str2.length;
  const sortedCodes: number[] = new Array(len1 + len2);

  for (let i = 0; i < len2; i++) {
    sortedCodes[i] = str2.charCodeAt(i);
  }

  for (let i = 0, j, currentCode; i < len1; i++) {
    currentCode = str.charCodeAt(i);
    for (j = len2 - 1; j >= 0 && sortedCodes[j] > currentCode; j--) {
      sortedCodes[j + 1] = sortedCodes[j];
    }
    sortedCodes[j + 1] = currentCode;
    len2++;
  }

  return String.fromCharCode(...sortedCodes);
}

