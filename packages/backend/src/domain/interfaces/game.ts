import { Static } from "@sinclair/typebox";
import { GameCreateValidation, GameUpdateValidation } from "../validations/game";
import { Game } from "generated/prisma-client-js";

export type GameId = Game['id'];
export type GameCreateAttributes = Static<typeof GameCreateValidation.schema>;
export type GameUpdateAttributes = Static<typeof GameUpdateValidation.schema>;
