// function merge(arr1, arr2) {
//   let arr3 = [];
//   let i = 0, j = 0;

//   while (i < arr1.length && j < arr2.length) {
//     if (arr1[i] < arr2[j])
//       arr3.push(arr1[i++]);
//     else
//       arr3.push(arr2[j++]);
//   }

//   while (i < arr1.length) arr3.push(arr1[i++]);
//   while (j < arr2.length) arr3.push(arr2[j++]);
//   return arr3;
// }

// // Function to implement Burstsort algorithm
// export default function burstSort(arr, start, end) {
//   // Base case: if array size is 1, return it
//   if (arr.length == 1) return arr;

//   let mid = (arr.length / 2) | 0;
//   // Sort the two sub-arrays and
//   // merge the sorted arrays into a single sorted array
//   return merge(burstSort(arr, 0, mid), burstSort(arr, mid, arr.length));
// }

export default function countingSort(inputArr, n = inputArr.length) {
  //Create a temporary with 0 zero value 
  //as the same length of max elemet + 1
  const temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  //Count the frequency of each element in the original array
  //And store it in temp array
  for (let i = 0; i < n; ++i) {
    ++temp[inputArr[i]];
  }

  // Update the count based on the previous index
  for (let i = 1; i <= 26; ++i) {
    // Updating elements of count array 
    temp[i] = temp[i] + temp[i - 1];
  }

  //Output arr
  const outputArr = [];

  for (let i = n - 1; i >= 0; --i) {
    // Add elements of array A to array B
    let t = inputArr[i];
    outputArr[temp[t] - 1] = t + 65;

    // Decrement the count value by 1
    temp[t] = temp[t] - 1;
  }

  return outputArr;
}