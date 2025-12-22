import Service from "./_service";
import { TileBag } from "game-core/src/core/game/TileBag";
import { HistoryEntry } from "game-core/src/core/game/HistoryEntry";
import { Board } from "game-core/src/core/game/Board";
import { HISTORY_DELIMITERS, HISTORY_ENTRY_DRAW_SEPARATOR, TILE_RACK_SIZE } from "game-core/src/core/game/const";
import { DomainValidationError } from "shared/exceptions/domain-validation-error";
import { TileRack } from "game-core/src/core/game/TileRack";
import { Game, GameUser, User } from "generated/prisma-client-js";
import { History } from "game-core/src/core/game/History";
import { GameCreateAttributes } from "domain/interfaces/game";
import { UserId } from "domain/interfaces/user";
import { GameCreateValidation } from "domain/validations/game";


export class GameService extends Service {
  // async getAllGames() {
  //   return await this.repositories.game.findAll();
  // }

  // async getGame(id: GameId) {
  //   return await this.repository.find(id);
  // }

  async getUserGameData(currentUserId: UserId, gameId: Game['id']) {
    const game = await this.repositories.game.findById(gameId);
    if (!game) throw new DomainValidationError('game invalid');
    const gameUsers = await this.repositories.gameUser.findAllByGameId(gameId, false);
    // Associate users to gameUsers
    const users = await this.repositories.user.findAllByIds([currentUserId].concat(gameUsers.map(gu => gu.userId)));
    const usersById = users.reduce((h, user) => {
      h[user.id] = user;
      return h;
    }, {} as Record<User['id'], User>);
    let currentGameUser = null;
    const otherGameUsers = [];
    for (let i = gameUsers.length - 1, gu: GameUser & { user: User }; i >= 0; --i) {
      gu = { ...gameUsers[i], user: usersById[gameUsers[i].userId] };
      if (gu.userId === currentUserId) {
        currentGameUser = gu;
      } else {
        otherGameUsers.push(gu);
      }
    }
    if (!currentGameUser) throw new DomainValidationError('game invalid');
    return { game, otherGameUsers, currentGameUser };
  }

  async createGame(currentUserId: UserId, data: GameCreateAttributes): Promise<Game | null> {
    this.checkData(GameCreateValidation.validator, data);

    const { userIds } = data;
    const userCount = userIds.length + 1;

    // Create a new Bag of tiles
    const tileBag = new TileBag();
    const tileBagContent = tileBag.content; // need to save this before we draw tiles

    let history = '';

    // Build Game Users & history
    const gameUsers = Array.from({ length: userCount }, (_, index) => {
      const tiles = tileBag.draw().join('');
      history += HISTORY_DELIMITERS.FIRST_DRAW + tiles;

      const build = {
        userId: index === 0 ? currentUserId : userIds[index - 1],
        index,
        tiles,
      } as GameUser;
      if (index === 0) build.accepted = true;
      return build;
    });

    // Create game
    let game;
    await this.transaction(async () => {
      game = await this.repositories.game.create({
        currentGameUserIndex: 0,
        tileBag: tileBagContent,
        history,
        userCount
      });

      gameUsers.forEach(gu => { gu.gameId = game!.id; })

      await this.repositories.gameUser.createMany(gameUsers);
    });
    return game || null;
  }


  // TODO: when game is over, return other players's score (coz they might got a penalty)
  async playTurn(userId: UserId, gameId: Game['id'], entry: string) {
    const historyEntry = new HistoryEntry(entry);

    // Validate entry
    if (!historyEntry.valid || historyEntry.isFirstDraw) {
      throw new DomainValidationError('entry invalid');
    }

    // Retrieve all the players. We need to ensure the current user is among them
    const gameUsers = await this.repositories.gameUser.findAllByGameId(gameId, false);
    const currentGameUser = gameUsers.find(gu => gu.userId === userId);
    if (!currentGameUser) throw new DomainValidationError('game invalid');

    // Retrieve the game by currentGameUserIndex, to ensure it's his turn.
    const game = await this.repositories.game.findByIdAndCurrentGameUserIndex(gameId, currentGameUser.index);

    // get next user
    const nextIndex = (currentGameUser.index + 1) % game.userCount;

    const nextGameUser = gameUsers.find(gu => gu.index === nextIndex);
    if (!nextGameUser) throw new DomainValidationError('game invalid');

    const gameUpdate: Partial<Game> = {
      history: game.history + entry,
      currentGameUserIndex: nextGameUser.index,
    };

    // Re-create currentGameUser's tile rack
    const tileRack = new TileRack(currentGameUser.tiles);

    // Ensure that the user/player has the tiles in his rack
    if (tileRack.remove(historyEntry.chars) === false) throw new DomainValidationError('tiles invalid');

    // Fill the TileBag from history and draw tiles
    const tileBag = new TileBag(game.tileBag, game.history + entry);
    const isTileBagSufficient = tileBag.length >= TILE_RACK_SIZE

    //////////////////////////////////////////////////////////////////////////
    // PASS TURN
    //////////////////////////////////////////////////////////////////////////
    if (historyEntry.isPassTurn) {
      const isGameOver = !isTileBagSufficient && new History(game.history + entry).isGameOver
      await this.transaction(async () => {
        if (isGameOver) {
          await this.applyEndgameRackPenalty(gameUsers);
          gameUpdate.isGameOver = true;
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
      if (!isTileBagSufficient) throw new DomainValidationError('tile bag not sufficient');

      await this.transaction(async () => {
        await this.repositories.game.update(gameId, gameUpdate);
        await this.repositories.gameUser.update(gameId, currentGameUser.index, { tiles: currentGameUser.tiles });
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
      gameUpdate.isGameOver = true;
      gameOverReason = 'EMPTY_RACK';
    } else if (tileBag.length < TILE_RACK_SIZE && board.isGameStuck(gameUsers.map(gu => gu.tiles))) {
      gameUpdate.isGameOver = true;
      gameOverReason = 'GAME_STUCK';
    }

    await this.transaction(async () => {
      await this.repositories.game.update(gameId, gameUpdate);
      // Update each player's score
      if (gameUpdate.isGameOver) {
        await this.applyEndgameRackPenalty(gameUsers, currentGameUser, gameOverReason === 'EMPTY_RACK');
      }
      await this.repositories.gameUser.update(gameId, currentGameUser.index, { tiles: currentGameUser.tiles, score: currentGameUser.score });
    });

    return { drawn, scores: gameUsers.map(gu => gu.score), isGameOver: gameUpdate.isGameOver };
  }

  private async applyEndgameRackPenalty(gameUsers: GameUser[], currentGameUser: GameUser | null = null, hasCurrentGameUserEmptiedRack: boolean = false) {
    let totalPoints = 0;
    for (let i = gameUsers.length - 1; i >= 0; --i) {
      const gameUser = gameUsers[i];
      const points = new TileRack(gameUser.tiles).value;
      if (points === 0) continue;
      gameUser.score -= points;
      totalPoints += points;
      if (gameUser.index !== currentGameUser?.index) {
        await this.repositories.gameUser.update(gameUser.gameId, gameUser.index, { score: gameUser.score });
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