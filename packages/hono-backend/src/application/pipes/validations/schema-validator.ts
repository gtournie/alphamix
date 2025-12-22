import { Context, ValidationTargets } from 'hono';
import { validator as honoValidator } from 'hono/validator'
import { Schema, SchemaType } from 'shared/utils/validator';

function schemaValidator<T extends SchemaType>(schema: T, errors: boolean) {
  const validate = Schema.compile(schema, { errors });

  if (errors) {
    return (value: any, c: Context<any, string, {}>): Schema.infer<T> | Response => {
      const { valid, errors } = validate(value);
      if (!valid) {
        return c.json({ errors }, 400);
      }
      return value;
    };
  }
  return (value: any, c: Context<any, string, {}>): Schema.infer<T> | Response => {
    if (validate(value).valid) return value;
    return c.text('invalid', 400);
  };
}

export function errorsValidator<T extends SchemaType>(type: keyof ValidationTargets, schema: T) {
  return honoValidator(type, schemaValidator(schema, true));
}

export function booleanValidator<T extends SchemaType>(type: keyof ValidationTargets, schema: T) {
  return honoValidator(type, schemaValidator(schema, false));
}