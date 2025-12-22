import { Type } from "@sinclair/typebox";

export const userIdValidation = Type.Object({
  id: Type.String(),
})

export const userCreateValidation = Type.Object({
  name: Type.String(),
  email: Type.String(),
})

export const userUpdateValidation = Type.Partial(userCreateValidation)

