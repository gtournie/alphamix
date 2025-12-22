import { UserId } from "../interfaces/user";
import Service from "./_service";


export class UserService extends Service {
  async getFriends(userId: UserId) {
    return await this.repositories.user.findFriends(userId);
  }

  // async getAllUsers() {
  //   return await this.repositories.user.findAll();
  // }

  // async getUser(id: UserId) {
  //   return await this.repositories.user.find(id);
  // }

  // async createUser(data: UserCreateAttributes) {
  //   this.checkData(UserCreateValidation, data);
  //   return await this.repositories.user.create(data);
  // }

  // async updateUser(id: UserId, data: UserUpdateAttributes) {
  //   this.checkData(UserUpdateValidation, data);
  //   return await this.repositories.user.update(id, data);
  // }

  // async deleteUser(id: UserId) {
  //   return await this.repositories.user.delete(id);
  // }
}