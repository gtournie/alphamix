import { History } from "game-core/src/core/game/History";
import { Game } from "generated/prisma-client-js";


interface UserDataGameDTO {
  id: Game['id'];
  isGameOver: Game['isGameOver'];
  currentGameUserIndex: Game['currentGameUserIndex'];
  history: Game['history'];
  updatedAt: Game['updatedAt'];
}

export class GameMapper {
  static toUserDataGameDto(game: Game): UserDataGameDTO {
    return {
      id: game.id,
      isGameOver: game.isGameOver,
      currentGameUserIndex: game.currentGameUserIndex,
      history: new History(game.history).boardVersion,
      updatedAt: game.updatedAt
    }
  }
}