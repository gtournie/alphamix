import { UserCreateValidation, UserUpdateValidation } from "../validations/user";
import { User } from "../../generated/prisma-client-js";
import { Static } from "@sinclair/typebox";

export type UserId = User['id'];
export type UserCreateAttributes = Static<typeof UserCreateValidation.schema>;
export type UserUpdateAttributes = Static<typeof UserUpdateValidation.schema>;
