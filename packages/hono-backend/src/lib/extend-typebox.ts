// import { Type } from '@sinclair/typebox';
// import { ErrorObject } from "ajv";
// import { ErrorFunction, SetErrorFunction } from '@sinclair/typebox/errors';
// import { DefaultErrorFunction } from 'shared/utils/TypeboxErrors';

// // A bit hacky. Need an array to be returned, not a string
// SetErrorFunction(DefaultErrorFunction as never as ErrorFunction)

// export function convertTypeBoxValidationErrors(errors: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined) {
//   if (!errors) return { error: 'unknown' };
//   return errors.reduce((h: Record<string, unknown>, e: ErrorObject<string, Record<string, any>, unknown>) => {
//     h[e.instancePath.slice(1).replace(/\//g, '.')] = e.message || 'invalid';
//     return h;
//   }, {})
// }

// const BIG_INT_PATTERN = '^[+-]?\\d+n?$';

// export const BigIntType = () => Type.Transform(Type.String({ pattern: BIG_INT_PATTERN }))
//   .Decode((value) => BigInt(value.replace(/n$/, '')))
//   .Encode(value => value.toString())

