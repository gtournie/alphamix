import { NotFoundError } from 'elysia';
import db from '../../db';
import { GameUser, GameStatus } from '@prisma/client';
import { shuffle } from '../../lib/array';

/**
 * Getting all games
 */
export async function getMany() {
  return await db.game.findMany({ orderBy: { createdAt: 'asc' } });
}

/**
 * Creating a game
 * @param attributes - The game attributes
 */
export async function createOne(userId: bigint, attributes: { userCount: number; }) {
  const { userCount } = attributes;
  // Pick a random number from 1 to userCount
  const randomIndex = Math.floor(Math.random() * userCount);

  // shuffle the tileBag using the Fisher-Yates algorithm.
  const shuffledTileBag = shuffle(tileBag.split('')).join(''); // TODO: TileBag comes from Board class or GAME or whatever

  // Then affects 7 tiles to each user and removes them from the tileBag
  const tilesPerUser = 7;
  const remainingTiles = shuffledTileBag.slice(tilesPerUser * userCount);

  // Don't forget to ensure tiles is not optional in GameUser model
  return await db.game.create({
    data: {
      tileBag: remainingTiles,
      userCount,
      gameUsers: {
        create: Array.from({ length: userCount }, (_, index) => ({
          index: index + 1,
          userId: index === randomIndex ? userId : null,
          tiles: shuffledTileBag.slice(index * tilesPerUser, (index + 1) * tilesPerUser),
        })),
      },
    }
  });
}

export async function joinOne(attributes: { id: bigint; userId: bigint }) {
  const { id, userId } = attributes;
  const game = await db.game.findUnique({ where: { id, status: GameStatus.WAITING_FOR_USERS }, include: { gameUsers: true } });
  if (!game) throw new NotFoundError(`game not found`);
  if (game.gameUsers.some(gp => gp.userId === userId)) throw new Error('User already in game');


  // Don't forget to ensure tiles is not optional in GameUser model
  return await db.game.create({
    data: {
      tileBag: remainingTiles,
      gameUsers: {
        create: Array.from({ length: userCount }, (_, index) => ({
          index: index + 1,
          userId: index === randomIndex ? userId : null,
          userCount,
          tiles: shuffledTileBag.slice(index * tilesPerUser, (index + 1) * tilesPerUser),
        })),
      },
    }
  });
}

/**
 * Getting a game by ID
 */
// export async function getOne(id: bigint) {
//   const game = await db.game.findUnique({ where: { id } });
//   if (!game) throw new NotFoundError(`game not found`);
//   return game;
// }

/**
 * Updating a game
 * @param id - The game ID
 * @param attributes - The game attributes
 */
export async function updateOne(id: bigint, attributes: { name: string; }) {
  const { name } = attributes;
  return await db.game.update({ where: { id }, data: { name } });
}

/**
 * Deleting a game
 * @param id - The game ID
 */
export async function deleteOne(id: bigint) {
  return await db.game.delete({ where: { id } });
}