function quickSort(str, leftPos, rightPos, arrLength, result) {
  let initialLeftPos = leftPos;
  let initialRightPos = rightPos;
  let pivot = rightPos;
  for (let direction = true; leftPos - rightPos < 0;) {
    if (direction === true) {
      if (str.charCodeAt(pivot) < str.charCodeAt(leftPos)) {
        result[pivot] = str.charCodeAt(leftPos);
        result[leftPos] = str.charCodeAt(pivot);

        pivot = leftPos;
        --rightPos;
        direction = false;
      } else {
        result[pivot] = str.charCodeAt(pivot);
        result[leftPos] = str.charCodeAt(leftPos);
        ++leftPos;
      }
    } else {
      if (str.charCodeAt(pivot) <= str.charCodeAt(rightPos)) {
        result[pivot] = str.charCodeAt(pivot);
        result[rightPos] = str.charCodeAt(rightPos);
        --rightPos;
      } else {
        result[pivot] = str.charCodeAt(rightPos);
        result[rightPos] = str.charCodeAt(pivot);

        ++leftPos;
        pivot = rightPos;
        direction = true;
      }
    }
  }
  if (pivot - 1 > initialLeftPos) {
    quickSort(str, initialLeftPos, pivot - 1, arrLength, result);
  }
  if (pivot + 1 < initialRightPos) {
    quickSort(str, pivot + 1, initialRightPos, arrLength, result);
  }
}

function sortAsciiString(str) {
  const output = [], len = str.length;
  quickSort(str, 0, len - 1, len, output);
  return String.fromCharCode(...output);
}