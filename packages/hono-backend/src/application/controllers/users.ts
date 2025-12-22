import { Hono } from 'hono';
import { services } from '../../domain/services';
// import { userIdValidation, userUpdateValidation } from '../pipes/validations/users';


const userRoutes = new Hono().basePath('/users')
  // .get('/', (c) => {
  //   return c.json(services.user.getAllUsers())
  // })
  .get('/friends', async (c) => {
    return c.json(await services.user.getFriends(c.get('currentUser').id));
  })

// .get('/:id', function ({ params: { id } }) {
//   return services.userService.getUser(id);
// })

// can only update its own profile
// .put('/', function ({ user: { id }, body }) {
//   return services.userService.updateUser(id, body as any)
// }, {
//   body: userUpdateValidation as any,
// })

// Not sure. Have to cascade everything. Plus, could only delete its own account
// .delete('/:id', function({ user: { id } }) {
//   return services.userService.deleteUser(id)
// });


export default userRoutes;

// console.log('toto')
