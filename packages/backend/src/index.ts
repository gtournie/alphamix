import { Elysia, Context, redirect, TSchema } from 'elysia';
import { cors } from '@elysiajs/cors'
import jwt from 'jsonwebtoken';
// import db from './db';
// import playerRoutes from './routes/players';
import { oauth2 } from "elysia-oauth2";
import { User, Prisma } from 'generated/prisma-client-js';
// import auth, { jwtMiddleware } from './auth';
import userRoutes from 'application/controllers/users';
import { Value } from "@sinclair/typebox/value";
import { ErrorFunction, SetErrorFunction } from '@sinclair/typebox/errors';
import { DefaultErrorFunction } from 'shared/utils/TypeboxErrors';
import convertTypeBoxValidationErrors from 'shared/utils/convertTypeBoxValidationErrors';
import successResponse from 'application/responses/successResponse';
import errorResponse from 'application/responses/errorResponse';
import gameRoutes from 'application/controllers/games';
import { betterAuth } from './my-better-auth';
import { auth } from './auth';

export const HOME_PATH = 'http://localhost:5173/';

// const USER_NAME_MAX_LENGTH = await (async () => {
//   const result: { character_maximum_length: number }[] = await db.$queryRaw(Prisma.sql`SELECT character_maximum_length 
//     FROM information_schema.columns 
//     WHERE column_name = 'name' AND table_name=${Prisma.ModelName.Player}`)
//     return result[0]?.character_maximum_length || 15;
// })()

// async function generateUniqueUsername(name: string): Promise<string | null> {
//   if (name.length === 0) return null;
//   if (name.length > USER_NAME_MAX_LENGTH) name = name.slice(0, USER_NAME_MAX_LENGTH);

//   name = name.replace(/[0-9]*$/, ''); // Remove numbers at the end
//   const queryVar = `${name}[0-9]*$`;
//   const result: { count: number, max: number }[] = await db.$queryRaw(Prisma.sql`
//     SELECT count(name) as count, max((regexp_match(name, '(\\d+)$'))[1]::integer) as max
//     FROM "Player"
//     WHERE name ~ ${queryVar}`);
//   const { max, count } = result[0];

//   if (count === 0) return name;

//   let username = name + ((max || 0) + 1);
//   if (username.length > USER_NAME_MAX_LENGTH) {
//     return await generateUniqueUsername(name.slice(0, -1));
//   }
//   return username;
// }

// function randomEmail() {
//   return Math.random().toString(36).substring(2, 15) + '@example.com';
// }
// const total = 100000;
// await db.player.createMany({
//   data: Array.from({ length: total }, (_, i) => {
//     return {
//       name: `Player${i + 2}`,
//       email: randomEmail(),
//     };
//   })
// });

// let values = [];
// for (let i = 0; i < total; ++i) {
//   values.push(`('${`Player${i + 2}`}', '${randomEmail()}')`);
// }
// console.log('data prepared')
// await db.$executeRawUnsafe(`INSERT INTO "Player" (name, email) VALUES ${values.join(', ')};`)
// // await db.player.create({ data: { name: 'Player', email: randomEmail() } });
// console.log('data inserted')


// console.log(await db.player.getUniquePlayerName('Player'));

// console.time('t')
// const name = 'Player';
// const shortName = name.replace(/[0-9]*$/, ''); // Remove numbers at the end
// const nameNum = `${name.toLowerCase()}[0-9]*$`;
// const result = await db.$queryRaw(Prisma.sql`
// WITH lat AS (
//   SELECT (regexp_match(name, '(\\d+)$'))[1]::bigint AS num
//   FROM "Player"
//   WHERE name ~* ${nameNum}
// )

// SELECT
//   (SELECT 1 FROM "Player" WHERE lower(name) = ${name.toLowerCase()} LIMIT 1) AS name_exists,
//   (SELECT 1 FROM "Player" WHERE lower(name) = ${shortName.toLowerCase()} LIMIT 1) AS short_name_exists,
//   COALESCE(
//     (SELECT s.i
//       FROM (SELECT generate_series(2, max(num) + 1) FROM lat) s(i)
//       WHERE NOT EXISTS (SELECT 1 FROM lat WHERE num = s.i LIMIT 1)
//       LIMIT 1
//     ), 2) AS next_num
// `);
// console.timeEnd('t')
// console.log(result[0]);


// const result = await db.$queryRaw(Prisma.sql`
//   SELECT count(name) as count, max((regexp_match(name, '(\\d+)$'))[1]::integer) as max
//   FROM "Player"
//   WHERE name ~ 'Guillaume[0-9]*$'`);

// console.log(result)

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

// A bit hacky. Need an array to be returned, not a string
SetErrorFunction(DefaultErrorFunction as never as ErrorFunction)


const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
  // validate request method
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    context.error(405)
  }
}

// Use the extended type to satisfy the constraint
let app = new Elysia()
  // if (['localhost', '127.0.0.1'].includes(app.server?.hostname || '')) {
  // .use(process.env.NODE_ENV !== 'production' ? cors() : new Elysia()) // TODO: https://www.better-auth.com/docs/integrations/elysia
  // }
  .onRequest(({ request }) => console.log(request.url))
  .use(cors())
  .all("/api/auth/*", betterAuthView)
  .use(betterAuth)
  .onError(({ code, error }) => {
    if (code === "UNKNOWN" && error instanceof Error) {
      if (error.name === "NOT_FOUND") {
        return errorResponse(404, error.name);
      }
      if (error.name === "VALIDATION_ERROR" && "details" in error) {
        return errorResponse(422, error.name, error.details);
      }
      if (error.name === "UNIQUE_CONSTRAINT_ERROR" && "fields" in error) {
        return errorResponse(422, error.name, error.fields);
      }
    }
    if ('VALIDATION' === code) {
      try {
        const msg = JSON.parse(error.message);
        if (Array.isArray(msg?.errors)) {
          // console.log(msg.errors)
          return errorResponse(422, 'VALIDATION_ERROR', convertTypeBoxValidationErrors(msg.errors));
        }
      } catch (parseError) {
        console.error("Error parsing validation message:", parseError);
        return errorResponse(500, 'INTERNAL_SERVER_ERROR');
      }
    }
    if (!['NOT_FOUND', 'VALIDATION'].includes(String(code))) {
      console.log(code, ({}).toString.call(error) === "[object Object]" ? JSON.stringify(error) : error.toString());
      return errorResponse(500, 'INTERNAL_SERVER_ERROR');
    }
  })
  // .group('/api', (app) =>
  //   app
  //     .use(playerRoutes)
  //     .get('/protected', jwtMiddleware, () => {
  //       return { message: 'This is a protected route' };
  //     })
  // )

  // .guard(
  // {
  //   beforeHandle: jwtMiddleware,
  // },
  // (app) =>
  // app
  // .use(auth)
  // .onBeforeHandle(jwtMiddleware)
  .onAfterHandle(({ response }) => successResponse(response))
  .group('/api', (app) =>
    app
      .use(userRoutes)
      .use(gameRoutes)
  )

  // )
  .listen(Number(process.env.PORT) || 3049);



console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

// try {
// await app.handle(
//   new Request('http://localhost:3049/api/players', {
//     method: 'PUT', // Spécifie la méthode PUT
//     headers: { 'Content-Type': 'application/json' }, // Définit le type de contenu
//     body: JSON.stringify({ name: 'NewPlayerName' }) // Corps de la requête
//   })
// );
// } catch(e) {
//   console.log(e);
// }