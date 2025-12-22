import { GameRepository } from "infrastructure/database/repositories/games";
import { GameUserRepository } from "infrastructure/database/repositories/game-users";
import { UserRepository } from "infrastructure/database/repositories/users";
import checkData from "../validations";

interface Repositories {
  game: GameRepository;
  gameUser: GameUserRepository;
  user: UserRepository;
};

export default class Service {
  protected repositories: Repositories;
  protected transaction: Function;

  constructor(repositories: Repositories, transaction: Function) {
    this.repositories = repositories;
    this.transaction = transaction;
  }

  checkData(...args: Parameters<typeof checkData>) {
    return checkData(...args);
  }
}