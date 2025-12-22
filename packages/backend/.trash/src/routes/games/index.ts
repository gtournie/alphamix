import { Elysia, t, Context, Static } from 'elysia';
import { createOne, deleteOne, getMany, updateOne } from './handlers';
import transformBigInt from '../../transformers/bigint';
import auth from '../../auth';

const transformId = transformBigInt(['id']);
const transformPlayerId = transformBigInt(['playerId']);

const playerRoutes = new Elysia({ prefix: '/players' })
  .use(auth) // Just for TS
  .get('/', () => getMany())
  .post('/', ({ player, body }) => createOne(player.id, body),
    {
      transform: transformPlayerId,
      body: t.Object({
        playerCount: t.Number({ min: 2, max: 4 }),
      }),
    }
  )
  // .get('/:id', ({ params: { id } }) => getOne(id), {
  //   transform: transformId,
  //   params: t.Object({
  //     id: t.BigInt()
  //   }),
  // })
  .put('/:id', ({ params: { id }, body }) => updateOne(id, body), {
    transform: transformId,
    params: t.Object({
      id: t.BigInt(),
    }),
    body: t.Object({
      name: t.String({ minLength: 3, maxLength: 15 })
    }),
  })
  .delete('/:id', ({ params: { id } }) => deleteOne(id), {
    transform: transformId,
    params: t.Object({
      id: t.BigInt(),
    }),
  });



export default playerRoutes;