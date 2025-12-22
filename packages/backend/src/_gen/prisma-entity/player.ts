import GamePlayer from "./game_player";
import Entity from "./index";

export default class Player extends Entity {
  id: BigInt;
  email: string;
  name: string;
  createdAt: Date;
  gamePlayers: GamePlayer[];
}
