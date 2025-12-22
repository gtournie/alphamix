import Elysia from "elysia";
import { auth } from "./auth";
import errorResponse from "./application/responses/errorResponse";
import { v4 as uuid } from 'uuid';


export const betterAuth = (() => {
  if (process.env.DEV_FAKE_AUTH === 'true' && process.env.NODE_ENV !== 'production') {
    return new Elysia({ name: "better-auth" })
      .mount(auth.handler)
      .derive({ as: "global" }, async () => {
        const userId = uuid();
        const today = new Date();
        return {
          user: {
            name: "Fake Name",
            email: "fake@fake-email.com",
            emailVerified: true,
            image: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            id: userId,
          },
          session: {
            expiresAt: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
            token: "lYlRpOXU0mECCFArUYyaZNJmiT8ZuaHc",
            createdAt: new Date(),
            updatedAt: new Date(),
            ipAddress: "",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
            userId: userId,
            id: uuid(),
          },
        };
      })
  }


  return new Elysia({ name: "better-auth" })
    .mount(auth.handler)
    .derive({ as: "global" }, async ({ headers }) => {
      const session = await auth.api.getSession({ headers });

      if (!session) return errorResponse(401, "NOT_AUTHORIZED");

      return {
        user: session.user,
        session: session.session,
      };
    })
})();