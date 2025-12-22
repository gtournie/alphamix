import { PlayerService } from "../../services/players";
import { repositories } from "../../infrastructure/database/repositories";

export const services = {
  get playerService() {
    return new PlayerService(repositories.playerRepository);
  },
};