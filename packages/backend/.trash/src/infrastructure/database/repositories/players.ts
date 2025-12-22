import { Player } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundError } from 'elysia';
import handleUniqueConstraints from '../../helpers/handleUniqueConstraints';

type PlayerAttributes = Partial<Omit<Player, 'id'>>;
type PlayerId = Player['id'];

export class PlayerRepository {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  async findAll(): Promise<Player[]> {
    return await this.db.player.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async find(id: PlayerId): Promise<Player> {
    const player = await this.db.player.findUnique({ where: { id } });
    if (!player) throw new NotFoundError(`Player not found`); // TODO: what kind of error. Should we throw an exception here?
    return player;
  }

  async create(data: PlayerAttributes): Promise<Player> {
    return handleUniqueConstraints(() => this.db.player.create({ data }));
  }

  async update(id: PlayerId, data: PlayerAttributes): Promise<Player> {
    return handleUniqueConstraints(() => this.db.player.update({ where: { id }, data }));
  }

  async delete(id: PlayerId) {
    return await this.db.player.delete({ where: { id } });
  }
}

