import { User, Game, GameUser, Prisma } from 'generated/prisma-client-js';
import handleUniqueConstraints from '../../helpers/handleUniqueConstraints';
import Repository from './_repository';
import handleNotFound from '../../helpers/handleNotFound';

type GameUserAttributes = Partial<Omit<GameUser, 'id'>>;
type GameUserId = GameUser['id'];
type UserId = User['id'];

// TODO: when canceling a gameUser, if userCount > 2 don't forget to update other player's index

export class GameUserRepository extends Repository {
  // async findAll(): Promise<GameUser[]> {
  //   return await this.db.gameUser.findMany({ orderBy: { createdAt: 'asc' } });
  // }

  // async find(id: GameId): Promise<Game> {
  //   return handleNotFound(() => this.db.gameUser.findUnique({ where: { id } }));
  // }

  async findAllByGameId(gameId: Game['id']): Promise<GameUser[]> {
    return this.db.gameUser.findMany({
      where: { gameId, canceled: false },
      orderBy: { userIndex: 'asc' }
    });
  }

  // async findByGameIdAndUserId(gameId: Game['id'], userId: UserId): Promise<GameUser> {
  //   return handleNotFound(() => this.db.gameUser.findUnique({ where: { userId, gameId } }));
  // }

  // async findByGameIdAndUserIndex(gameId: Game['id'], userIndex: number): Promise<GameUser> {
  //   return handleNotFound(() => this.db.gameUser.findUnique({ where: { userIndex, gameId } }));
  // }

  // async updateScores(gameUsers: Partial<Pick<GameUser, 'id' | 'score'>>[]) {
  //   for (let i = gameUsers.length - 1; i >= 0; --i) {
  //     const { id, score } = gameUsers[i];
  //     this.db.gameUser.update({ where: { id }, data: { score } });
  //   }
  // }


  async update(id: GameUserId, data: GameUserAttributes): Promise<Game> {
    return handleUniqueConstraints(() => this.db.gameUser.update({ where: { id }, data }));
  }

  // async delete(id: GameId) {
  //   return handleNotFound(() => this.db.gameUser.delete({ where: { id } }));
  // }
}

