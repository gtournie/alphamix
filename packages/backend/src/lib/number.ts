
// Not needed anymore

// export function toBigInt(id: string | number | bigint) {
//   const strId = '' + id;
//   if (!isNaN(id as unknown as number)) {
//     const bigint = BigInt(strId);
//     if ('' + bigint === strId) return bigint;
//   }
//   return id;
// }

// export function toNumber(id: string | number | bigint) {
//   const strId = '' + id;
//   if (!isNaN(id as unknown as number)) {
//     const num = +strId;
//     if ('' + num === strId) return num;
//   }
//   return id;
// }