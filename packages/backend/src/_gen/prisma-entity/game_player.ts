import Game from "./game";
import Player from "./player";
import Entity from "./index";

export default class GamePlayer extends Entity {
  id: BigInt;
  game: Game;
  gameId: BigInt;
  player?: Player;
  playerId?: BigInt;
  index: number;
  score: number;
  tiles: string;
  updatedAt: Date;
  currentGames: Game[];
}
