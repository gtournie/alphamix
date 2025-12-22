import { User, Game, Prisma } from 'generated/prisma-client-js';
import handleUniqueConstraints from '../../helpers/handleUniqueConstraints';
import Repository from './_repository';
import handleNotFound from '../../helpers/handleNotFound';

type GameAttributes = Partial<Omit<Game, 'id'>>;
type GameId = Game['id'];
type UserId = User['id'];

export class GameRepository extends Repository {
  async findAll(): Promise<Game[]> {
    return await this.db.game.findMany({ orderBy: { createdAt: 'asc' } });
  }

  // async find(id: GameId): Promise<Game> {
  //   return handleNotFound(() => this.db.game.findUnique({ where: { id } }));
  // }

  async findByIdAndCurrentGameUserId(id: GameId, currentGameUserId: UserId): Promise<Game> {
    return handleNotFound(() => this.db.game.findUnique({ where: { id, currentGameUserId } }));
  }

  async create(data: GameAttributes & { gameUsers: Prisma.GameUserCreateNestedManyWithoutGameInput["create"] }): Promise<Game> {
    const createArgs = {
      ...data,
      gameUsers: {
        create: data.gameUsers, // Associe les joueurs au jeu
      },
    };
    return handleUniqueConstraints(() => this.db.game.create({ data: createArgs }));
  }

  async update(id: GameId, data: GameAttributes): Promise<Game> {
    return handleUniqueConstraints(() => this.db.game.update({ where: { id }, data }));
  }

  // async delete(id: GameId) {
  //   return handleNotFound(() => this.db.game.delete({ where: { id } }));
  // }
}

