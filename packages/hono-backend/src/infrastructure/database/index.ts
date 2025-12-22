import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from '@prisma/client'
import { DATABASE_URL } from '../../../db.config'

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter, log: ['query'] }).$extends({
  query: {
    user: {
      async $allOperations({ args, query }) {
        if (args && 'data' in args) {
          const a = args as Prisma.UserCreateArgs | Prisma.UserUpdateArgs;

          if (typeof a.data?.name === 'string' && a.data.name.length > 15) {
            a.data.name = a.data.name.slice(0, 15)
          }
        }
        return query(args)
      },
    },
  },
  model: {
    user: {
      async getUniqueUserName(name: string): Promise<string | null> {
        if (name.length === 0) return null;
        if (name.length > USER_NAME_MAX_LENGTH) name = name.slice(0, USER_NAME_MAX_LENGTH);

        const shortName = name.replace(/[0-9]*$/, ''); // Remove numbers at the end
        const nameNum = `${shortName.toLowerCase()}[0-9]*$`;
        const result: { name_exists: number, short_name_exists: number, next_num: number }[] = await prisma.$queryRaw(Prisma.sql`
WITH lat AS (
  SELECT (regexp_match(name, '(\\d+)$'))[1]::bigint AS num, lower(name) AS name
  FROM "${Prisma.ModelName.User}"
  WHERE name ~* ${nameNum}
)
SELECT
  (SELECT 1 FROM lat WHERE name = ${name.toLowerCase()} LIMIT 1) AS name_exists,
  (SELECT 1 FROM lat WHERE name = ${shortName.toLowerCase()} LIMIT 1) AS short_name_exists,
  COALESCE(
    (SELECT s.i
      FROM (SELECT generate_series(2, max(num) + 1) FROM lat) s(i)
      WHERE NOT EXISTS (SELECT 1 FROM lat WHERE num = s.i LIMIT 1)
      LIMIT 1
    ), 2) AS next_num
`);
        const { name_exists, short_name_exists, next_num } = result[0] || {};
        if (!name_exists) return name;
        if (!short_name_exists) return shortName;

        name = shortName + next_num;
        if (name.length > USER_NAME_MAX_LENGTH) {
          return await this.getUniqueUserName(shortName.slice(0, -1));
        }
        return name;
      }
    },
  },
})

export const USER_NAME_MAX_LENGTH = await (async () => {
  const result: { character_maximum_length: number }[] = await prisma.$queryRaw(Prisma.sql`SELECT character_maximum_length 
    FROM information_schema.columns 
    WHERE column_name = 'name' AND table_name=${Prisma.ModelName.User}`)
  return result[0]?.character_maximum_length || 15;
})()

// BigInt fix
// prisma.$use(async (params, next) => {
//   // Check for BigInt parameters
//   if (params.args?.where?.id instanceof BigInt) {
//     params.args.where.id = params.args.where.id.toString(); // Convert BigInt to string
//   }
//   console.log('Prisma Middleware');
//   console.log(params)
//   const result = await next(params)
//   // See results here
//   return result
// })

export default prisma;