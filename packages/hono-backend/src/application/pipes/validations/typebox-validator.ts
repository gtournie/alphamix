// import type { TSchema } from '@sinclair/typebox';
// import Ajv from 'ajv';
// import addFormats from 'ajv-formats';
// import { Context, ValidationTargets } from 'hono';
// import { validator as honoValidator } from 'hono/validator'
// import { convertTypeBoxValidationErrors } from 'lib/extend-typebox';

// const ajv = new Ajv({ coerceTypes: true, allErrors: true });
// addFormats(ajv);


// function typeboxValidator<T extends TSchema>(schema: T) {
//   const validate = ajv.compile(schema);

//   return (value: unknown, c: Context<any, string, {}>) => {
//     const valid = validate(value);
//     if (!valid) {
//       return c.json(convertTypeBoxValidationErrors(validate.errors), 400);
//     }
//     return value;
//   };
// }

// export function validator(type: keyof ValidationTargets, schema: T) {
//   return honoValidator(type, typeboxValidator(schema));
// }