import User from "./user";
import Entity from "./index";

export default class Account extends Entity {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  user: User;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}
