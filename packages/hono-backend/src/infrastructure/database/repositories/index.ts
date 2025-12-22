
import db from "..";
import { UserRepository } from "./users";
import { GameRepository } from "./games";
import { GameUserRepository } from "./game-users";

export const repositories = {
  get user() {
    return new UserRepository(db);
  },
  get game() {
    return new GameRepository(db);
  },
  get gameUser() {
    return new GameUserRepository(db);
  },
};

export async function transaction(fn: Function) {
  return await db.$transaction(async (prisma) => {
    return await fn();
  });
};