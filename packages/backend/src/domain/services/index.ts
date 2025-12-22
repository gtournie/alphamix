import { UserService } from "./users";
import { repositories, transaction } from "../../infrastructure/database/repositories";
import { GameService } from "./games";


export const services = {
  get userService() {
    return new UserService(repositories, transaction);
  },
  get gameService() {
    return new GameService(repositories, transaction);
  }
};
