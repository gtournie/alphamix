import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import Google from '@auth/core/providers/google'
import { repositories } from 'infrastructure/database/repositories';
import gameRoutes from 'application/controllers/games';
import { generateOauthUserUUID } from 'lib/provider-uuid';
import { AdapterUser } from '@auth/core/adapters';
import userRoutes from 'application/controllers/users';
import { HTTPException } from 'hono/http-exception'
// import { SchemaTypeRegistry, TSchemaValidations, SchemaType } from 'shared/utils/validator'

declare global {
  interface BigInt {
    /**
     * Converts a BigInt to a JSON-compatible string.
     * @returns {string} The string representation of the BigInt.
     */
    toJSON(): string;
  }
}
// Fix for BigInt serialization
global.BigInt.prototype.toJSON = function (): string {
  return this.toString();
};


interface CurrentUser {
  id: string;
  email: string;
  name: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    currentUser: CurrentUser
  }
}


const app = new Hono().basePath('/api');

// TODO: add proudction server origin
app.use(csrf({
  origin: [
    'http://localhost:3049',
    'http://192.168.1.14:3049',
    'http://localhost:5173',
    'http://192.168.1.14:5173',
    'http://192.168.1.59:5173'
  ]
}));
app.use('/*', cors({
  origin: [
    'http://localhost:3049',
    'http://192.168.1.14:3049',
    'http://localhost:5173',
    'http://192.168.1.14:5173',
    'http://192.168.1.59:5173'
  ], credentials: true
}));

// app.use('/*', cors({
//   origin: '', credentials: true
// }));

app.use(
  '*',
  initAuthConfig((c) => ({
    basePath: '/api/auth',
    secret: process.env.AUTH_SECRET,
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        // authorization: { params: { redirect_uri: 'http://localhost:3049/api/auth/callback/google' } }
      }),
    ],
    callbacks: {
      // TODO: return to a page explaining we need a verified email here.
      async signIn({ profile }) {
        if (profile && 'email_verified' in profile && !profile.email_verified) return false;
        return true;
      },
      // 19a900dd-d2c5-4b85-c1c3-bdfcabe5770c
      async jwt({ user, token, account, profile, trigger }) {
        if (trigger === "signIn" && account) {
          delete token.name;
          delete token.email;
          delete token.picture;
          // Save the user.
          // TODO: use the special function to ensure name is unique
          // Profile has given_name and family_name (google)
          token.user = await repositories.user.findOrCreate({
            id: generateOauthUserUUID(account.provider, account.providerAccountId),
            email: profile?.email || user?.email || '',
            name: (profile?.given_name || user?.name || '').slice(0, 15),
          });
        }
        return token
      },
      async session({ session, token }) {
        session.user = token.user as AdapterUser;
        return session
      },
      async redirect({ url, baseUrl }) {
        return url;
      }
    }
  }))
);

if (process.env.FAKE_ENV === 'true') {
  app.use('/auth/*', authHandler());
  app.use('/*', verifyAuth());
  app.use('/*', async (c, next) => {
    c.set('currentUser', c.get('authUser')?.token?.user as CurrentUser);
    await next();
  });
} else {
  console.log("-- Using fake user strategy. Juste ensure you have a user in db")
  const user = await repositories.user.findFakeUserByEmail("gtournie@gmail.com");

  app.use('/auth/session', async (c) => c.json({ user }));
  app.use('/auth/csrf', async (c) => c.json({ csrfToken: "blablabla" }));
  app.use('/*', async (c, next) => {
    c.set('currentUser', user);
    await next();
  });
}


// app.get('/protected', (c) => {
//   const auth = c.get('authUser');
//   return c.json(auth);
// });

app.route('/', gameRoutes);
app.route('/', userRoutes);

// TODO: handle errors
// app.onError((err, c) => {
//   if (err instanceof HTTPException) {
//     // TODO: console ?
//     // Get the custom response
//     console.log(err.message)
//     console.log(err.getResponse())
//     return err.getResponse()
//   }
//   return c.text('Internal Server Error', 500);
// })

// console.log(repositories.user.findFriends())

export default app