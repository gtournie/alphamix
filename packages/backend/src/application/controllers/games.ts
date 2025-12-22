import { Elysia, t } from 'elysia';
import { services } from '../../domain/services';
// import transformBigInt from '../pipes/transformers/bigint';
import { gameCreateValidation, gameIdValidation, gameUpdateValidation } from '../pipes/validations/game';
import { betterAuth } from '../../my-better-auth';
import transformInt from 'application/pipes/transformers/number';
import { Type } from '@sinclair/typebox';

const transformUserCount = transformInt('body', 'userCount');

const gameRoutes = new Elysia({ prefix: '/games' })
  .use(betterAuth)

  .get('/', function () {
    return services.gameService.getAllGames()
  })

  .post('/', function ({ user: { id }, body }) {
    return services.gameService.createGame(id, body as any);
  }, {
    transform: transformUserCount,
    body: gameCreateValidation as any
  })

  // TODO: validate params, body...
  .post('/play/:id', function ({ params: { id: gameId }, user: { id: userId }, body }) {
    return services.gameService.playTurn(userId, gameId, body.entry);
  }, {
    params: gameIdValidation as any,
    body: t.Object({ entry: t.String() }) // Not sure to use elysia typebox...
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


