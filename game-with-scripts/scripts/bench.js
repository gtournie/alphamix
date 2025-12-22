// (() => {
//   const r = 1000000;
//   let t = 0;
//   let word = "RAUZBEX";
//   let arrWord = word.split('')
//   let n = 1
//   const hm = {}
//   for (let i = 0; i < 26; ++i) hm[i] = i.toString(26);

//   const A_CODE = 'A'.charCodeAt(0);

//   function quickSort(arr, leftPos, rightPos, arrLength) {
//     let initialLeftPos = leftPos;
//     let initialRightPos = rightPos;
//     let pivot = rightPos;
//     for (let direction = true; leftPos - rightPos < 0;) {
//       if (direction === true) {
//         if (arr[pivot] < arr[leftPos]) {
//           let tmp = arr[pivot];
//           arr[pivot] = arr[leftPos];
//           arr[leftPos] = tmp;

//           pivot = leftPos;
//           --rightPos;
//           direction = false;
//         } else {
//           ++leftPos;
//         }
//       } else {
//         if (arr[pivot] <= arr[rightPos]) {
//           --rightPos;
//         } else {
//           let tmp = arr[pivot];
//           arr[pivot] = arr[rightPos];
//           arr[rightPos] = tmp;

//           ++leftPos;
//           pivot = rightPos;
//           direction = true;
//         }
//       }
//     }
//     if (pivot - 1 > initialLeftPos) {
//       quickSort(arr, initialLeftPos, pivot - 1, arrLength);
//     }
//     if (pivot + 1 < initialRightPos) {
//       quickSort(arr, pivot + 1, initialRightPos, arrLength);
//     }
//   }

//   function sortAsciiString1(str) {
//     const output = [], len = str.length;
//     for (let i = len - 1; i >= 0; --i) output.push(str.charCodeAt(i));
//     quickSort(output, 0, len - 1, len);
//     return String.fromCharCode(...output);
//   }

//   function sortAsciiString2(str) {
//     let count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//     for (let i = str.length - 1; i >= 0; --i) {
//       ++count[str.charCodeAt(i) - A_CODE];
//     }
//     let output = [];
//     for (let i = 0; i < 26; ++i) {
//       for (let j = count[i]; j !== 0; --j) {
//         output.push(i + A_CODE);
//       }
//     }
//     return String.fromCharCode(...output);
//   }

//   function sortAsciiString3(str) {
//     let sortedCodes = [];

//     for (let i = str.length - 1; i >= 0; --i) { // Décrémentation de i
//       let currentCode = str.charCodeAt(i);
//       let j;

//       // Remplace le while par un for qui décale les éléments plus grands
//       for (j = sortedCodes.length - 1; j >= 0 && sortedCodes[j] > currentCode; --j) {
//         sortedCodes[j + 1] = sortedCodes[j];
//       }

//       // Insère le charCode à la bonne position
//       sortedCodes[j + 1] = currentCode;
//     }

//     return String.fromCharCode(...sortedCodes);
//   }

//   function sortAsciiString4(str) {
//     let sortedCodes = [];

//     for (let i = str.length - 1; i >= 0; --i) { // Décrémentation de i
//       let currentCode = str.charCodeAt(i) - A_CODE;
//       let j;

//       // Remplace le while par un for qui décale les éléments plus grands
//       for (j = sortedCodes.length - 1; j >= 0 && sortedCodes[j] > currentCode; --j) {
//         sortedCodes[j + 1] = sortedCodes[j];
//       }

//       // Insère le charCode à la bonne position
//       sortedCodes[j + 1] = currentCode;
//     }
//     let sum = '';
//     for (let j = sortedCodes.length - 1; j >= 0; --j) {
//       sum += hm[sortedCodes[j]];
//     }
//     return sum;
//   }

//   function sortAsciiString5(str) {
//     let count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//     for (let i = str.length - 1; i >= 0; --i) {
//       ++count[str.charCodeAt(i) - A_CODE];
//     }
//     let sum = '';
//     for (let i = 0; i < 26; ++i) {
//       if (count[i] !== 0) sum += (Math.pow(26, count[i]) * i).toString(26);
//     }
//     return sum;
//   }

//   function sortAsciiString6(str) {
//     let sortedCodes = [];

//     for (let i = str.length - 1; i >= 0; --i) { // Décrémentation de i
//       let currentCode = str.charCodeAt(i) - A_CODE;
//       let j;

//       // Remplace le while par un for qui décale les éléments plus grands
//       for (j = sortedCodes.length - 1; j >= 0 && sortedCodes[j] > currentCode; --j) {
//         sortedCodes[j + 1] = sortedCodes[j];
//       }

//       // Insère le charCode à la bonne position
//       sortedCodes[j + 1] = currentCode;
//     }
//     if (sortedCodes.length < 12) {
//       let sum = 0;
//       let pow = 1;
//       for (let i = sortedCodes.length - 1; i >= 0; --i) {
//         sum += pow * sortedCodes[i];
//         pow *= 26;
//       }
//       return sum;
//     }
//     return String.fromCharCode(...sortedCodes);
//   }

//   function sortAsciiString7(str) {
//     const count = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
//     for (let i = str.length - 1; i >= 0; --i) {
//       count[str.charCodeAt(i) - A_CODE].push(str.charCodeAt(i));
//     }
//     const output = [];
//     for (let i = 0; i < 26; ++i) if (count[i].length !== 0) output.push(...count[i]);
//     return String.fromCharCode(...output);
//   }

//   console.time('t' + ++t)
//   for (let i = 0; i < r; ++i) sortAsciiString1(word)
//   console.timeEnd('t' + t)

//   console.time('t' + ++t)
//   for (let i = 0; i < r; ++i) sortAsciiString2(word)
//   console.timeEnd('t' + t)

//   console.time('t' + ++t)
//   for (let i = 0; i < r; ++i) sortAsciiString3(word)
//   console.timeEnd('t' + t)

//   console.time('t' + ++t)
//   for (let i = 0; i < r; ++i) sortAsciiString4(word)
//   console.timeEnd('t' + t)

//   console.time('t' + ++t)
//   for (let i = 0; i < r; ++i) sortAsciiString5(word)
//   console.timeEnd('t' + t)

//   console.time('t' + ++t)
//   for (let i = 0; i < r; ++i) sortAsciiString6(word)
//   console.timeEnd('t' + t)

//   console.time('t' + ++t)
//   for (let i = 0; i < r; ++i) sortAsciiString7(word)
//   console.timeEnd('t' + t)
// })()

function toto(str, blanks, callback) {
  if (blanks.length === 0) return callback(str);

  const positions = {};
  let found = false;
  for (let i = str.length - 1; i >= 0; --i) {
    const c = str.charAt(i);
    if (blanks.indexOf(c) >= 0) {
      found = true;
      if ((c in positions) === false) {
        positions[c] = [i];
      } else {
        positions[c].push(i);
      }
    }
  }
  if (found === false) return callback(str);




}

