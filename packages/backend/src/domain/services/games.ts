import { GameCreateAttributes, GameId, GameUpdateAttributes } from "../interfaces/game";
import { UserId } from "../interfaces/user";
import { GameCreateValidation, GameUpdateValidation } from "../validations/game";
import Service from "./_service";
import { TileBag } from "game-core/src/core/game/TileBag";
import { HistoryEntry } from "game-core/src/core/game/HistoryEntry";
import { Board } from "game-core/src/core/game/Board";
import { HISTORY_DELIMITERS, HISTORY_ENTRY_DRAW_SEPARATOR, TILE_RACK_SIZE } from "game-core/src/core/game/const";
import { DomainValidationError } from "shared/exceptions/domain-validation-error";
import { TileRack } from "game-core/src/core/game/TileRack";
import { Game, GameStatus, GameUser } from "generated/prisma-client-js";
import { History } from "game-core/src/core/game/History";


export class GameService extends Service {
  async getAllGames() {
    return await this.repositories.game.findAll();
  }

  // async getGame(id: GameId) {
  //   return await this.repository.find(id);
  // }

  async createGame(userId: UserId, data: GameCreateAttributes) {
    this.checkData(GameCreateValidation, data);

    const { userCount } = data;

    // Pick a random number from 1 to userCount
    const randomIndex = Math.floor(Math.random() * userCount);

    // Create a new Bag of tiles
    const tileBag = new TileBag();
    const tileBagContent = tileBag.content; // need to save this before we draw tiles

    let history = '';

    // Build Game Users spots
    const gameUsers = Array.from({ length: userCount }, (_, userIndex) => {
      const tiles = tileBag.draw().join('');
      history += HISTORY_DELIMITERS.FIRST_DRAW + tiles;

      return {
        userId: userIndex === randomIndex ? userId : null,
        userIndex,
        tiles,
      };
    });

    // Create game
    // TODO: you must set currentGamUserId !!
    return await this.repositories.game.create({
      tileBag: tileBagContent,
      history,
      userCount,
      gameUsers
    });
  }


  // TODO: when game is over, return other players's score (coz they might got a penalty)
  async playTurn(userId: UserId, gameId: GameId, entry: string) {
    const historyEntry = new HistoryEntry(entry);

    // Validate entry
    if (!historyEntry.valid || historyEntry.isFirstDraw) {
      throw new DomainValidationError('entry invalid');
    }

    // Retrieve all the players. We need to ensure the current user is among them
    const gameUsers = await this.repositories.gameUser.findAllByGameId(gameId);
    const currentGameUser = gameUsers.find(gu => gu.userId === userId);
    if (!currentGameUser) throw new DomainValidationError('game invalid');

    // Retrieve the game by currentGameUserId, to ensure it's his turn.
    const game = await this.repositories.game.findByIdAndCurrentGameUserId(gameId, currentGameUser.id);

    // get next user
    const nextUserIndex = (currentGameUser.userIndex + 1) % game.userCount;
    const nextGameUser = gameUsers.find(gu => gu.userIndex === nextUserIndex);
    if (!nextGameUser) throw new DomainValidationError('game invalid');

    const gameUpdate: Partial<Game> = {
      history: game.history + entry,
      currentGameUserId: nextGameUser.id,
    };

    // TODO: no, this status is set to STARTED when all players have joined
    if (game.status === GameStatus.WAITING_FOR_USERS) gameUpdate.status = GameStatus.STARTED;

    // Re-create currentGameUser's tile rack
    const tileRack = new TileRack(currentGameUser.tiles);

    // Ensure that the user/player has the tiles in his rack
    if (tileRack.remove(historyEntry.chars) === false) throw new DomainValidationError('tiles invalid');

    // Fill the TileBag from history and draw tiles
    const tileBag = new TileBag(game.tileBag, game.history + entry);

    //////////////////////////////////////////////////////////////////////////
    // PASS TURN
    //////////////////////////////////////////////////////////////////////////
    if (historyEntry.isPassTurn) {
      const isGameOver = tileBag.length < TILE_RACK_SIZE && new History(game.history + entry).isGameOver
      await this.transaction(async () => {
        if (isGameOver) {
          await this.applyEndgameRackPenalty(gameUsers);
          gameUpdate.status = GameStatus.ENDED;
        }
        await this.repositories.game.update(gameId, gameUpdate);
      });
      return isGameOver ? { isGameOver, scores: gameUsers.map(gu => gu.score) } : { isGameOver };
    }

    // Draw new tiles
    const drawn = tileBag.draw(historyEntry.chars.length).join('');
    if (drawn) {
      tileRack.add(drawn);
      gameUpdate.history += HISTORY_ENTRY_DRAW_SEPARATOR + drawn;
    }
    currentGameUser.tiles = tileRack.content; // We'll need this to check if game is stuck

    //////////////////////////////////////////////////////////////////////////
    // CHANGE TILES
    //////////////////////////////////////////////////////////////////////////
    if (historyEntry.isChangeTilesTurn) {
      await this.transaction(async () => {
        await this.repositories.game.update(gameId, gameUpdate);
        await this.repositories.gameUser.update(currentGameUser.id, { tiles: currentGameUser.tiles });
      });
      return { drawn };
    }

    //////////////////////////////////////////////////////////////////////////
    // PLAY WORD
    //////////////////////////////////////////////////////////////////////////
    let board;
    try {
      // Re-create the board from history
      board = Board.buildFromHistory(game.history);

      // Add the new word to the board and calc the score
      currentGameUser.score += board.playWord(historyEntry).score;
    } catch (e) {
      throw new DomainValidationError('game invalid');
    }

    let gameOverReason = '';
    if (currentGameUser.tiles.length === 0) {
      gameUpdate.status = GameStatus.ENDED;
      gameOverReason = 'EMPTY_RACK';
    } else if (tileBag.length < TILE_RACK_SIZE && board.isGameStuck(gameUsers.map(gu => gu.tiles))) {
      gameUpdate.status = GameStatus.ENDED;
      gameOverReason = 'GAME_STUCK';
    }

    await this.transaction(async () => {
      await this.repositories.game.update(gameId, gameUpdate);
      // Update each player's score
      if (gameUpdate.status === GameStatus.ENDED) {
        await this.applyEndgameRackPenalty(gameUsers, currentGameUser, gameOverReason === 'EMPTY_RACK');
      }
      await this.repositories.gameUser.update(currentGameUser.id, { tiles: currentGameUser.tiles, score: currentGameUser.score });
    });

    return { drawn, scores: gameUsers.map(gu => gu.score), isGameOver: gameUpdate.status === GameStatus.ENDED };
  }


  private async applyEndgameRackPenalty(gameUsers: GameUser[], currentGameUser: GameUser | null = null, hasCurrentGameUserEmptiedRack: boolean = false) {
    let totalPoints = 0;
    for (let i = gameUsers.length - 1; i >= 0; --i) {
      const gameUser = gameUsers[i];
      const points = new TileRack(gameUser.tiles).value;
      if (points === 0) continue;
      gameUser.score -= points;
      totalPoints += points;
      if (gameUser.id !== currentGameUser?.id) {
        await this.repositories.gameUser.update(gameUser.id, { score: gameUser.score });
      }
    }
    if (currentGameUser && hasCurrentGameUserEmptiedRack) currentGameUser.score += totalPoints;
  }

  // async updateGame(id: GameId, data: GameUpdateAttributes) {
  //   this.checkData(GameUpdateValidation, data);
  //   return await this.repository.update(id, data);
  // }

  // async deleteGame(id: GameId) {
  //   return await this.repository.delete(id);
  // }
}