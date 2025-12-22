import { NotFoundError } from 'elysia';
import db from '../../db';
import { GamePlayer, GameStatus } from '@prisma/client';
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
export async function createOne(playerId: bigint, attributes: { playerCount: number; }) {
  const { playerCount } = attributes;
  // Pick a random number from 1 to playerCount
  const randomIndex = Math.floor(Math.random() * playerCount);

  // shuffle the tileBag using the Fisher-Yates algorithm.
  const shuffledTileBag = shuffle(tileBag.split('')).join(''); // TODO: TileBag comes from Board class or GAME or whatever

  // Then affects 7 tiles to each player and removes them from the tileBag
  const tilesPerPlayer = 7;
  const remainingTiles = shuffledTileBag.slice(tilesPerPlayer * playerCount);

  // Don't forget to ensure tiles is not optional in GamePlayer model
  return await db.game.create({
    data: {
      tileBag: remainingTiles,
      playerCount,
      gamePlayers: {
        create: Array.from({ length: playerCount }, (_, index) => ({
          index: index + 1,
          playerId: index === randomIndex ? playerId : null,
          tiles: shuffledTileBag.slice(index * tilesPerPlayer, (index + 1) * tilesPerPlayer),
        })),
      },
    }
  });
}

export async function joinOne(attributes: { id: bigint; playerId: bigint }) {
  const { id, playerId } = attributes;
  const game = await db.game.findUnique({ where: { id, status: GameStatus.WAITING_FOR_PLAYERS }, include: { gamePlayers: true } });
  if (!game) throw new NotFoundError(`game not found`);
  if (game.gamePlayers.some(gp => gp.playerId === playerId)) throw new Error('Player already in game');


  // Don't forget to ensure tiles is not optional in GamePlayer model
  return await db.game.create({
    data: {
      tileBag: remainingTiles,
      gamePlayers: {
        create: Array.from({ length: playerCount }, (_, index) => ({
          index: index + 1,
          playerId: index === randomIndex ? playerId : null,
          playerCount,
          tiles: shuffledTileBag.slice(index * tilesPerPlayer, (index + 1) * tilesPerPlayer),
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