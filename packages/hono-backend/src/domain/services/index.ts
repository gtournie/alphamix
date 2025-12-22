import { UserService } from "./users";
import { repositories, transaction } from "../../infrastructure/database/repositories";
import { GameService } from "./games";


export const services = {
  get user() {
    return new UserService(repositories, transaction);
  },
  get game() {
    return new GameService(repositories, transaction);
  }
};
