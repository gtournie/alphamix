import { NotFoundError } from 'elysia';
import db from '../../db';

/**
 * Getting all players
 */
export async function getMany() {
  return await db.player.findMany({ orderBy: { createdAt: 'asc' } });
}

/**
 * Getting a player by ID
 */
export async function getOne(id: bigint) {
  const player = await db.player.findUnique({ where: { id } });
  if (!player) throw new NotFoundError(`Player not found`);
  return player;
}

/**
 * Creating a player
 * @param attributes - The player attributes
 */
export async function createOne(attributes: { name: string; }) {
  const { name } = attributes;
  return await db.player.create({ data: { name } });
}

/**
 * Updating a player
 * @param id - The player ID
 * @param attributes - The player attributes
 */
export async function updateOne(id: bigint, attributes: { name: string; }) {
  const { name } = attributes;
  return await db.player.update({ where: { id }, data: { name } });
}

/**
 * Deleting a player
 * @param id - The player ID
 */
export async function deleteOne(id: bigint) {
  return await db.player.delete({ where: { id } });
}