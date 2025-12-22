import { Type } from "@sinclair/typebox/type";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const createSchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 15 }),
  email: Type.String({ format: 'email' }),
});

const updateSchema = Type.Partial(createSchema)

export const UserCreateValidation = { schema: createSchema, validator: TypeCompiler.Compile(createSchema) };

export const UserUpdateValidation = { schema: updateSchema, validator: TypeCompiler.Compile(updateSchema) };
