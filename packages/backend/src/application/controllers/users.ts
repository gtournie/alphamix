import { Elysia } from 'elysia';
import { services } from '../../domain/services';
import { userIdValidation, userUpdateValidation } from '../pipes/validations/users';
// import transformBigInt from '../pipes/transformers/bigint';
import { betterAuth } from '../../my-better-auth';

// const transformId = transformBigInt('params', 'id');

const userRoutes = new Elysia({ prefix: '/users' })
  .use(betterAuth)

  .get('/', function () {
    return services.userService.getAllUsers()
  })

  .get('/:id', function ({ params: { id } }) {
    return services.userService.getUser(id);
  }, {
    params: userIdValidation as any,
  })

  // can only update its own profile
  .put('/', function ({ user: { id }, body }) {
    return services.userService.updateUser(id, body as any)
  }, {
    body: userUpdateValidation as any,
  })

// Not sure. Have to cascade everything. Plus, could only delete its own account
// .delete('/:id', function({ user: { id } }) {
//   return services.userService.deleteUser(id)
// });


export default userRoutes;

// console.log('toto')
