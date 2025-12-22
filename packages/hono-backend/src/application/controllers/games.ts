import { Hono } from 'hono';
import { services } from '../../domain/services';
// import { validator } from 'application/pipes/validations/typebox-validator';
import { booleanValidator, errorsValidator } from 'application/pipes/validations/schema-validator';
// import { Type } from '@sinclair/typebox';
import "../../shared/utils/validator"
import { Schema } from '../../shared/utils/validator';
import { GameMapper } from 'application/mappers/GameMapper';
import { GameUserMapper } from 'application/mappers/GameUserMapper';


const gameRoutes = new Hono().basePath('/games')
  // .post('/test/:test',
  //   booleanValidator('param', Schema.Object({ test: Schema.toBigInt() })),
  //   booleanValidator('json', Schema.Object({ entry: Schema.String() })),
  //   async (c) => {
  //     console.log(c.req.valid('json').entry);
  //     return c.json({ toto: 'titi', param: c.req.valid('param').test });
  //   })

  // .get('/', async (c) => {
  //   const result = services.game.getAllGames();
  //   return c.json(result);
  // })

  .get('/:gameId',
    booleanValidator('param', Schema.Object({ gameId: Schema.toBigInt() })),
    async (c) => {
      const { game, otherGameUsers, currentGameUser } = await services.game.getUserGameData(
        c.get('currentUser').id,
        c.req.valid('param').gameId
      );
      return c.json({
        game: GameMapper.toUserDataGameDto(game),
        currentGameUser: GameUserMapper.toCurrentUserDataGameDto(currentGameUser),
        otherGameUsers: otherGameUsers.map(GameUserMapper.toOtherUserDataGameDto)
      });
    })

  // Create game
  .post('/',
    booleanValidator('json', Schema.Object({ userIds: Schema.Array(Schema.String()) })),
    async (c) => {
      const game = await services.game.createGame(
        c.get('currentUser').id,
        c.req.valid('json')
      );
      return c.json({ id: game?.id });
    })

  // Play game
  .post('/play/:gameId',
    booleanValidator('param', Schema.Object({ gameId: Schema.toBigInt() })),
    booleanValidator('json', Schema.Object({ entry: Schema.String() })),
    async (c) => {
      const result = await services.game.playTurn(
        c.get('currentUser').id,
        c.req.valid('param').gameId,
        c.req.valid('json').entry
      );
      return c.json(result);
    })

// .get('/:id', function({ params: { id } }) {
//   return services.gameService.getGame(id);
// }, {
//   params: gameIdValidation,
// })

// // can only update its own profile
// .put('/', function({ game: { id }, body }) {
//   console.log("HIT")
//   return services.gameService.updateGame(id || 1n, body)
// }, {
//   body: gameUpdateValidation,
// })


export default gameRoutes;


