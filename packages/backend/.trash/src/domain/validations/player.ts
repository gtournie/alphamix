import { Type } from "@sinclair/typebox/type";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const schema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 15 }),
  email: Type.String({ format: 'email' }),
});
const validator = TypeCompiler.Compile(schema);

export const PlayerValidation = { schema, validator: TypeCompiler.Compile(schema) };
