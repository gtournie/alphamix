// import { t as elysiaT, ValidationError } from 'elysia';
// import { TTransform, TUnion, TString, TBigInt } from '@sinclair/typebox';

// declare module 'elysia' {
//   interface ElysiaType {
//     bigint: () => {};
//   }
// }
// declare module '@sinclair/typebox' {
//   interface JavaScriptTypeBuilder {
//     bigint: () => TTransform<TUnion<[TString, TBigInt]>, bigint>;
//   }
// }

// elysiaT.bigint = () => {
//   const schema = elysiaT.BigInt(); // Uses the base BigInt type
//   return elysiaT.Transform(
//     elysiaT.Union(
//       [
//         elysiaT.String({ default: '0' }), // Accepts strings
//         elysiaT.BigInt()          // Accepts BigInt
//       ],
//     )
//   )
//     .Decode((value) => {
//       const bigint = BigInt(value); // Transforms to BigInt
//       if (String(bigint) !== String(value)) {
//         throw new ValidationError('property', schema, bigint); // Validation: must be even
//       }
//       return bigint; // Returns the transformed BigInt
//     })
//     .Encode((value) => value.toString()); // Encodes to string if necessary
// };

// export const t = elysiaT; // Export the extended type