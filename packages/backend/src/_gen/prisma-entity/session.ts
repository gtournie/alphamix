import User from "./user";
import Entity from "./index";

export default class Session extends Entity {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
  user: User;
}
