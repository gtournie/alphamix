import { Elysia, t } from 'elysia';
import { createOne, deleteOne, getOne, getMany, updateOne } from './handlers';
import transformBigInt from '../../transformers/bigint';

const transformId = transformBigInt(['id']);

const playerRoutes = new Elysia({ prefix: '/players' })
  .get('/', () => getMany())
  .post('/', ({ body }) => createOne(body), {
    body: t.Object({
      name: t.String({ minLength: 3, maxLength: 15 })
    })
  })
  .get('/:id', ({ params: { id } }) => getOne(id), {
    transform: transformId,
    params: t.Object({
      id: t.BigInt()
    }),
  })
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