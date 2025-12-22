import { User } from 'generated/prisma-client-js';
import handleUniqueConstraints from '../../helpers/handleUniqueConstraints';
import Repository from './_repository';
import handleNotFound from '../../helpers/handleNotFound';

type UserAttributes = Partial<Omit<User, 'id'>>;
type UserId = User['id'];

export class UserRepository extends Repository {
  async findAll(): Promise<User[]> {
    return await this.db.user.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async find(id: UserId): Promise<User> {
    return handleNotFound(() => this.db.user.findUnique({ where: { id } }));
  }

  async create(data: UserAttributes): Promise<User> {
    return handleUniqueConstraints(() => this.db.user.create({ data }));
  }

  async update(id: UserId, data: UserAttributes): Promise<User> {
    return handleUniqueConstraints(() => this.db.user.update({ where: { id }, data }));
  }

  async delete(id: UserId) {
    return handleNotFound(() => this.db.user.delete({ where: { id } }));
  }
}
