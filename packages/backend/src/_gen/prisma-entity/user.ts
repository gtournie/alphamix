import Session from "./session";
import Account from "./account";
import Entity from "./index";

export default class User extends Entity {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  sessions: Session[];
  accounts: Account[];
}
