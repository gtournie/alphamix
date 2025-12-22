import { Elysia, error as HttpError, Context, redirect, TSchema } from 'elysia';
import jwt from 'jsonwebtoken';
// import db from './db';
// import playerRoutes from './routes/players';
import { oauth2 } from "elysia-oauth2";
import { Player, Prisma } from '@prisma/client';
import auth, { jwtMiddleware } from './auth';
import playerRoutes from './controllers/players';
import { Value } from "@sinclair/typebox/value";
import { ErrorFunction, SetErrorFunction } from '@sinclair/typebox/errors';
import { DefaultErrorFunction } from './shared/utils/TypeboxErrors';
import convertTypeBoxValidationErrors from './shared/utils/ConvertTypeBoxValidationErrors';

export const HOME_PATH = '/';

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

// Use the extended type to satisfy the constraint
const app = new Elysia()
  .onError(({ code, error }) => {
    if (code === "UNKNOWN" && error instanceof Error) {
      if (error.name === "VALIDATION_ERROR" && "details" in error) {
        return HttpError(422, { error: error.name, details: error.details }); // TODO: details is not "usable"
      }
      if (error.name === "UNIQUE_CONSTRAINT_ERROR" && "fields" in error) {
        return HttpError(422, { error: error.name, fields: error.fields });
      }
    }
    if ('VALIDATION' === code) {
      try {
        const msg = JSON.parse(error.message);
        if (Array.isArray(msg?.errors)) {
          return HttpError(422, { error: "VALIDATION_ERROR", details: convertTypeBoxValidationErrors(msg.errors) })
        }
      } catch (parseError) {
        console.error("Error parsing validation message:", parseError);
        return HttpError(500, 'Internal Server Error');
      }
    }
    if (!['NOT_FOUND', 'VALIDATION'].includes(String(code))) {
      console.log(code, error.toString());
      return HttpError(500, 'Internal Server Error');
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
  .use(auth)
  .onBeforeHandle(jwtMiddleware)
  .group('/api', (app) =>
    app
      .use(playerRoutes)
  )

  // )
  .listen(Number(process.env.PORT) || 3049);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);