import Player from "./player";
import Game from "./game";
import GamePlayer from "./game_player";
import User from "./user";
import Session from "./session";
import Account from "./account";
import Verification from "./verification";

export default class Entity {
  static get all(): Entity[] {
    return [Player, Game, GamePlayer, User, Session, Account, Verification];
  }

  static get Player() {
    return Player;
  }
  static get Game() {
    return Game;
  }
  static get GamePlayer() {
    return GamePlayer;
  }
  static get User() {
    return User;
  }
  static get Session() {
    return Session;
  }
  static get Account() {
    return Account;
  }
  static get Verification() {
    return Verification;
  }
}
