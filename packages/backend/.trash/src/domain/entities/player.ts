// export class Player {
//   name: string;
//   email: string;

//   constructor(player: Player) {
//     this.name = player.name;
//     this.email = player.email;
//   }

//   // Exemple de logique métier : Valider le format de l'email
//   validateEmail(): boolean {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(this.email);
//   }

//   // Exemple de méthode métier : Mettre à jour le nom
//   updateName(newName: string): void {
//     if (newName.length < 3 || newName.length > 15) {
//       throw new Error("Name must be between 3 and 15 characters.");
//     }
//     this.name = newName;
//   }
// }


import Player from "./player";
import Game from "./game";
import GamePlayer from "./game_player";
import { TSchema } from "elysia";
import { TypeCheck, TypeCompiler } from "@sinclair/typebox/compiler";


export default class Entity {
  static get all(): Entity[] {
    return [Player, Game, GamePlayer];
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

  // static validation: TScheme;
  // static validator: TypeCheck<TSchema>;

  static validation: Record<string, { schema: TSchema; validator: TypeCheck<TSchema> }> = {};

  static validate(schema: TSchema) {
    this.validation = {
      schema,
      validator: TypeCompiler.Compile(schema)
    };
  }

  constructor(obj: unknown) {
    Object.assign(this, obj);
  }
}
