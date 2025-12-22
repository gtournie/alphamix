import { GameCreateValidation } from "../validations/game";
import { Game } from "generated/prisma-client-js";
import { Schema } from "shared/utils/validator";

export type GameId = Game['id'];

export type GameCreateAttributes = Schema.infer<typeof GameCreateValidation.schema>;

