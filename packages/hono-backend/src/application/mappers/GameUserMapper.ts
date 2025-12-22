import { GameUser, User } from "generated/prisma-client-js";


interface UserDataGameUserDTO {
  index: GameUser['index'];
  score: GameUser['score'];
  accepted: GameUser['accepted'];
  tiles?: GameUser['tiles'];
  name: User['name']
}

export class GameUserMapper {
  static toCurrentUserDataGameDto(gu: GameUser & { user: User }): UserDataGameUserDTO {
    return {
      index: gu.index,
      score: gu.score,
      accepted: gu.accepted,
      tiles: gu.tiles,
      name: gu.user.name
    }
  }

  static toOtherUserDataGameDto(gu: GameUser & { user: User }): UserDataGameUserDTO {
    return {
      index: gu.index,
      score: gu.score,
      accepted: gu.accepted,
      name: gu.user.name
    }
  }
}