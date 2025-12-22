// import { UserCreateValidation, UserUpdateValidation } from "../validations/user";
// import { Static } from "@sinclair/typebox";
import { User } from "../../generated/prisma-client-js";

export type UserId = User['id'];
export type UserEmail = User['email'];
// export type UserCreateAttributes = Static<typeof UserCreateValidation.schema>;
// export type UserUpdateAttributes = Static<typeof UserUpdateValidation.schema>;
