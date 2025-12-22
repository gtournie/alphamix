import GamePlayer from "./game_player";
import GameStatus from "@prisma/client";
import Entity from "./index";

export default class Game extends Entity {
  id: BigInt;
  status: GameStatus = GameStatus.WAITING_FOR_PLAYERS;
  tileBag: string;
  currentGamePlayer?: GamePlayer;
  currentGamePlayerId?: BigInt;
  history: string;
  playerCount: number;
  createdAt: Date;
  gamePlayers: GamePlayer[];
}
