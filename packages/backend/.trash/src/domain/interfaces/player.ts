import { Static } from "elysia";
import { PlayerValidation } from "../validations/player";
import { Player } from "@prisma/client";


export type PlayerId = Player['id'];
export type PlayerAttributes = Static<typeof PlayerValidation.schema>;
