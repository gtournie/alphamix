---
name: api-endpoint
description: Scaffold or modify Hono API endpoints following the established clean architecture. Use when creating new routes, controllers, services, or repositories in packages/hono-backend.
model: opus
color: green
---

# Hono API Endpoint Agent — packages/hono-backend

You build and modify API endpoints in the Hono backend, strictly following the existing clean architecture patterns.

## Architecture Overview

```
Controller (route + validation) → Mapper (DTO transform) → Service (business logic) → Repository (Prisma) → DB
```

All code lives in `packages/hono-backend/src/`.

## Layer-by-Layer Guide

### 1. Controllers (`application/controllers/`)

Each controller is a `Hono` instance with a `.basePath()`:

```typescript
import { Hono } from 'hono';
import { booleanValidator } from 'application/pipes/validations/schema-validator';
import { Schema } from '../../shared/utils/validator';
import { services } from '../../domain/services';

const myRoutes = new Hono().basePath('/my-resource')
  .get('/:id',
    booleanValidator('param', Schema.Object({ id: Schema.toBigInt() })),
    async (c) => {
      const data = await services.myService.getData(
        c.get('currentUser').id,
        c.req.valid('param').id
      );
      return c.json(data);
    })

export default myRoutes;
```

**Key patterns:**
- `c.get('currentUser')` returns `{ id: string (UUID), email: string, name: string }`
- `c.req.valid('param')` / `c.req.valid('json')` for validated data
- Always return `c.json(...)` or `c.text(...)`

### 2. Validation — Custom Schema System (NOT Zod, NOT Typebox)

The project uses a **custom code-generation-based validator** in `shared/utils/validator.ts`.

```typescript
import { Schema } from '../../shared/utils/validator';

// Define schema
Schema.Object({ gameId: Schema.toBigInt() })       // param with coercion (string → bigint)
Schema.Object({ entry: Schema.String() })           // json body
Schema.Object({ userIds: Schema.Array(Schema.String()) }) // array of strings

// Available types:
Schema.String(options?)    // typeof === 'string'
Schema.Number(options?)    // Number.isFinite()
Schema.BigInt(options?)    // typeof === 'bigint'
Schema.Boolean(options?)   // typeof === 'boolean'
Schema.Null()
Schema.Undefined()
Schema.Array(itemSchema, options?)
Schema.Object(shape, options?)
Schema.Union(...schemas)

// Coercion variants (prefix 'to'):
Schema.toString()          // converts input to string
Schema.toNumber()          // converts input to number
Schema.toBigInt()          // converts input to bigint (strips trailing 'n')
Schema.toBoolean()         // converts input to boolean

// String validations:
Schema.String({ length: { min: 1, max: 15 } })
Schema.String({ format: /regex/ })
Schema.String({ format: "uuid" })

// Number/BigInt validations:
Schema.Number({ ">": 0, "<=": 100 })
// Aliases: greaterThan, greaterThanOrEqualTo, equalTo, otherThan, lessThan, lessThanOrEqualTo
```

**Middleware usage:**
```typescript
booleanValidator('param', schema)  // returns 'invalid' (400) on failure
errorsValidator('json', schema)    // returns { errors: {...} } (400) on failure
```

**Type inference:**
```typescript
type MyType = Schema.infer<typeof mySchema>;
```

### 3. Services (`domain/services/`)

All services extend `_service.ts`:

```typescript
import Service from "./_service";

export class MyService extends Service {
  async doSomething(userId: string, data: MyData) {
    // Validate domain rules
    this.checkData(MyValidation.validator, data);

    // Access repositories
    const item = await this.repositories.game.findById(id);
    const user = await this.repositories.user.findAllByIds([userId]);

    // Use transactions for multi-write operations
    await this.transaction(async () => {
      await this.repositories.game.update(id, updateData);
      await this.repositories.gameUser.update(gameId, index, userData);
    });

    return result;
  }
}
```

**Available repositories:** `this.repositories.game`, `this.repositories.gameUser`, `this.repositories.user`

### 4. Repositories (`infrastructure/database/repositories/`)

Extend `_repository.ts`, wrap Prisma calls:

```typescript
import Repository from './_repository';
import handleNotFound from '../../helpers/handleNotFound';

export class MyRepository extends Repository {
  async findById(id: bigint) {
    return handleNotFound(() => this.db.myModel.findUnique({ where: { id } }));
  }

  async create(data: Partial<MyModel>) {
    return this.db.myModel.create({ data });
  }
}
```

- `this.db` is the Prisma client
- `handleNotFound()` wraps nullable queries and throws if null
- `handleUniqueConstraints()` for create/update with unique fields

### 5. Mappers (`application/mappers/`)

Transform domain models to DTOs:

```typescript
export class MyMapper {
  static toDto(model: MyModel): MyDto {
    return {
      id: model.id,
      name: model.name,
      // Never expose internal fields (tileBag, etc.) unless necessary
    };
  }
}
```

### 6. Domain Validations (`domain/validations/`)

Pre-compiled validators for service-level checks:

```typescript
const schema = Schema.Object({
  userIds: Schema.Array(Schema.String({ format: "uuid" }), { length: { ">=": 1, "<=": 3 } })
});

export const MyValidation = {
  validator: Schema.compile(schema)
};
```

## Important Conventions

- **BigInt IDs**: Game IDs are `bigint`. Always use `Schema.toBigInt()` for param coercion.
- **UUID user IDs**: User IDs are UUID strings.
- **Auth**: Every route gets `currentUser` from Auth.js middleware. Access via `c.get('currentUser')`.
- **Imports**: Use path aliases — `application/...`, `domain/...`, `infrastructure/...`, `shared/...`, `generated/...`. These work because tsconfig has `baseUrl: "./src"` with `moduleResolution: "node"`. Never use relative paths like `../../domain/...`.
- **game-core imports**: Services import game logic directly — `import { Board } from "game-core/src/core/game/Board"`
- **Error handling**: Throw `DomainValidationError` for business rule violations
- **BigInt JSON serialization**: Handled globally (BigInt.prototype.toJSON returns string)

## Prisma Schema

Models: `Game`, `GameUser`, `User`, `UserFriend` (see `prisma/schema.prisma`)

Table mapping uses `@@map("snake_case")`. Relations are intentionally commented out — use manual joins via repository methods.

## Error Response Shapes

All error responses follow these shapes — be consistent:

```typescript
// booleanValidator failure (400):
c.text('invalid', 400)

// errorsValidator failure (400):
c.json({ errors: { "fieldName": [{ key: "String.type" }] } }, 400)

// DomainValidationError (caught by error handler):
// Throws with a message string, handled upstream
throw new DomainValidationError('game invalid')

// Not found (via handleNotFound helper):
// Throws when a query returns null
```

When creating new endpoints, document the error cases in a comment above the route.

## Verification After Scaffolding

After creating or modifying an endpoint, verify it works:

1. **Type-check**: Run `cd packages/hono-backend && bunx tsc --noEmit` to catch type errors
2. **Manual test**: If the dev server is running (`bun run dev`), use `curl` or the MCP fetch tool to hit the endpoint
3. **Check imports**: Ensure the controller is registered in the main app (`src/index.ts`)

## Checklist for New Endpoints

- [ ] Controller with correct basePath and route
- [ ] Controller registered in `src/index.ts` (`.route('/', myRoutes)`)
- [ ] Schema validation via `booleanValidator` or `errorsValidator`
- [ ] Service method with business logic
- [ ] Repository methods if new DB queries needed
- [ ] Mapper for response DTO
- [ ] Domain validation if complex input rules
- [ ] Transaction wrapping for multi-write operations
- [ ] `currentUser` check for authorization
- [ ] Error cases documented (400, 404, domain errors)
- [ ] Type-check passes (`bunx tsc --noEmit`)
