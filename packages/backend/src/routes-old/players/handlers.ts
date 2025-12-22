import { NotFoundError } from 'elysia';
import db from '../../db';

/**
 * Getting all users
 */
export async function getMany() {
  return await db.user.findMany({ orderBy: { createdAt: 'asc' } });
}

/**
 * Getting a user by ID
 */
export async function getOne(id: bigint) {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError(`User not found`);
  return user;
}

/**
 * Creating a user
 * @param attributes - The user attributes
 */
export async function createOne(attributes: { name: string; }) {
  const { name } = attributes;
  return await db.user.create({ data: { name } });
}

/**
 * Updating a user
 * @param id - The user ID
 * @param attributes - The user attributes
 */
export async function updateOne(id: bigint, attributes: { name: string; }) {
  const { name } = attributes;
  return await db.user.update({ where: { id }, data: { name } });
}

/**
 * Deleting a user
 * @param id - The user ID
 */
export async function deleteOne(id: bigint) {
  return await db.user.delete({ where: { id } });
}