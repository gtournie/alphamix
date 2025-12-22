import { Type } from "@sinclair/typebox";

export const gameIdValidation = Type.Object({
  id: Type.String()
})

export const gameCreateValidation = Type.Object({
  userCount: Type.Number(),
})

export const gameUpdateValidation = Type.Partial(gameCreateValidation)