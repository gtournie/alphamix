import { Game, Prisma } from 'generated/prisma-client-js';
import handleUniqueConstraints from '../../helpers/handleUniqueConstraints';
import Repository from './_repository';
import handleNotFound from '../../helpers/handleNotFound';

type GameAttributes = Partial<Omit<Game, 'id'>>;
type GameId = Game['id'];

export class GameRepository extends Repository {
  // async findAll(): Promise<Game[]> {
  //   return await this.db.game.findMany({ orderBy: { createdAt: 'asc' } });
  // }

  async findById(id: GameId): Promise<Game> {
    return handleNotFound(() => this.db.game.findUnique({ where: { id } }));
  }

  async findByIdAndCurrentGameUserIndex(id: GameId, currentGameUserIndex: Game['currentGameUserIndex']): Promise<Game> {
    return handleNotFound(() => this.db.game.findUnique({ where: { id, currentGameUserIndex } }));
  }

  async create(data: GameAttributes): Promise<Game> {
    return this.db.game.create({ data });
  }

  async update(id: GameId, data: GameAttributes): Promise<Game> {
    return this.db.game.update({ where: { id }, data });
  }

  // async delete(id: GameId) {
  //   return handleNotFound(() => this.db.game.delete({ where: { id } }));
  // }
}

