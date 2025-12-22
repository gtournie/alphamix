import { Game, GameUser } from 'generated/prisma-client-js';
import handleUniqueConstraints from '../../helpers/handleUniqueConstraints';
import Repository from './_repository';
import handleNotFound from 'infrastructure/helpers/handleNotFound';

type GameUserAttributes = Partial<Omit<GameUser, 'id'>>;

// TODO: when canceling a gameUser, if userCount > 2 don't forget to update other player's index

export class GameUserRepository extends Repository {
  // async findAll(): Promise<GameUser[]> {
  //   return await this.db.gameUser.findMany({ orderBy: { createdAt: 'asc' } });
  // }

  // async find(id: GameId): Promise<Game> {
  //   return handleNotFound(() => this.db.gameUser.findUnique({ where: { id } }));
  // }

  async createMany(data: GameUserAttributes[]): Promise<GameUser[]> {
    // return handleUniqueConstraints(() => this.db.gameUser.createMany({ data }));
    return this.db.gameUser.createMany({ data });
  }

  async findAllByGameId(gameId: Game['id'], onlyAccepted: boolean): Promise<GameUser[]> {
    const where: { gameId: Game['id'], accepted?: boolean } = { gameId };
    if (onlyAccepted) where.accepted = true;
    return this.db.gameUser.findMany({ where, orderBy: { index: 'asc' } });
  }

  async findByGameIdAndUserId(gameId: Game['id'], userId: GameUser['userId']): Promise<GameUser> {
    return handleNotFound(() => this.db.gameUser.findUnique({ where: { userId, gameId } }));
  }

  // async findByGameIdAndUserIndex(gameId: Game['id'], userIndex: number): Promise<GameUser> {
  //   return handleNotFound(() => this.db.gameUser.findUnique({ where: { userIndex, gameId } }));
  // }

  // async updateScores(gameUsers: Partial<Pick<GameUser, 'id' | 'score'>>[]) {
  //   for (let i = gameUsers.length - 1; i >= 0; --i) {
  //     const { id, score } = gameUsers[i];
  //     this.db.gameUser.update({ where: { id }, data: { score } });
  //   }
  // }


  async update(gameId: Game['id'], index: Game['currentGameUserIndex'], data: GameUserAttributes): Promise<Game> {
    return handleUniqueConstraints(() => this.db.gameUser.update({ where: { gameId_index: { gameId, index } }, data }));
  }

  // async delete(id: GameId) {
  //   return handleNotFound(() => this.db.gameUser.delete({ where: { id } }));
  // }
}

