import { User } from 'generated/prisma-client-js';
import handleUniqueConstraints from '../../helpers/handleUniqueConstraints';
import Repository from './_repository';
import handleNotFound from '../../helpers/handleNotFound';

type UserAttributes = Partial<Omit<User, 'id'>>;
type UserId = User['id'];

export class UserRepository extends Repository {

  // async findAll(): Promise<User[]> {
  //   return await this.db.user.findMany({ orderBy: { createdAt: 'asc' } });
  // }

  // async find(id: UserId): Promise<User> {
  //   return handleNotFound(() => this.db.user.findUnique({ where: { id } }));
  // }

  async findAllByIds(userIds: User['id'][]): Promise<User[]> {
    return await this.db.user.findMany({ where: { id: { in: userIds } } });
  }

  // Used by fakeUser feature
  async findFakeUserByEmail(email: User['email'], select = { id: true, email: true, name: true }): Promise<User> {
    return handleNotFound(() => this.db.user.findUnique({ where: { email }, select }));
  }

  async findOrCreate(data: Pick<User, "id" | "email" | "name">): Promise<Pick<User, "id" | "email" | "name">> {
    return handleNotFound(() => this.db.user.upsert({
      where: { id: data.id },
      update: {},
      create: data,
      select: { id: true, email: true, name: true }
    }));
  }

  async findFriends(userId: UserId): Promise<Pick<User, "id" | "email" | "name">[]> {
    return await this.db.$queryRaw<User[]>`
  SELECT u.id, u.name, u.email
  FROM users u
  JOIN users_friends uf ON uf."friendId" = u.id
  WHERE uf."userId" = (${userId})::uuid`;
  }

  // async create(data: UserAttributes): Promise<User> {
  //   return handleUniqueConstraints(() => this.db.user.create({ data }));
  // }

  // async update(id: UserId, data: UserAttributes): Promise<User> {
  //   return handleUniqueConstraints(() => this.db.user.update({ where: { id }, data }));
  // }

  // async delete(id: UserId) {
  //   return handleNotFound(() => this.db.user.delete({ where: { id } }));
  // }
}
