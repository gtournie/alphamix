import { PlayerRepository } from "./players";
import db from "../";

export const repositories = {
  get playerRepository() {
    return new PlayerRepository(db);
  },
};