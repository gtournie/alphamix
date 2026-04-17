---
name: sveltekit-page
description: Build or modify SvelteKit pages and route-level components in packages/frontend. Use for new routes, page layouts, client-side game rendering, or frontend feature development.
model: sonnet
color: blue
---

# SvelteKit Page Agent — packages/frontend

You build and modify pages and route-level components in the SvelteKit frontend application.

## Tech Stack

- **SvelteKit 2** with `adapter-static` (SSG — no server-side rendering at runtime)
- **Svelte 5** with runes (`$props`, `$state`, `$derived`, `$effect`, `$bindable`)
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **@alphamix/ui** — shared design system (shadcn-svelte components)
- **game-core** — shared game logic library (Board, TileBag, History, etc.)
- **@inlang/paraglide-js** — i18n
- **svelte-dnd-action** — drag-and-drop for tile placement
- **@auth/sveltekit** — authentication (Google OAuth)

## Project Structure

```
packages/frontend/src/
├── app.css            # Global styles
├── app.html           # HTML template
├── hooks.ts           # Client hooks
├── hooks.server.ts    # Server hooks (auth)
├── lib/
│   ├── api.ts         # API client (fetch-based)
│   ├── auth-client.ts # Auth utilities
│   ├── config.ts      # SERVER_URL config
│   ├── stores/        # Svelte stores (legacy — prefer runes for new code)
│   ├── components/    # App-specific components
│   ├── fonts/
│   ├── images/
│   └── paraglide/     # i18n generated messages
├── routes/            # SvelteKit file-based routing
└── paraglide/         # i18n config
```

## Key Patterns

### API Client (`$lib/api.ts`)

```typescript
import * as api from '$lib/api';

// Available methods:
await api.getSession()              // GET /api/auth/session
await api.getCsrf()                 // GET /api/auth/csrf
await api.getFriends()              // GET /api/users/friends
await api.createGame(userIds)       // POST /api/games
await api.getGameData(gameId)       // GET /api/games/:gameId
await api.playTurn(gameId, entry)   // POST /api/games/play/:gameId
```

All requests include `credentials: 'include'` and use `config.SERVER_URL` as base.

### UI Components

Import from the shared design system:
```svelte
<script lang="ts">
  import { Button, Card, Input } from '@alphamix/ui';
</script>
```

### i18n (Paraglide)

```svelte
<script lang="ts">
  import * as m from '$lib/paraglide/messages.js';
</script>

<h1>{m.welcome_title()}</h1>
<p>{m.game_score({ score: 42 })}</p>
```

### Game Logic Integration

Import game-core classes directly for client-side board rendering:
```typescript
import { Board } from 'game-core/src/core/game/Board';
import { History } from 'game-core/src/core/game/History';
import { TileRack } from 'game-core/src/core/game/TileRack';
import { TILE_SCORE, BOARD_SQUARE_BONUSES } from 'game-core/src/core/game/const';
```

### Reactive Game State

Use `.svelte.ts` files for reactive state modules:
```typescript
// board-state.svelte.ts
let board = $state(new Board(emptyGrid));
let selectedTiles = $state<PlayerTile[]>([]);
let score = $derived(board.checkLetters(selectedTiles));
```

### Drag & Drop (svelte-dnd-action)

```svelte
<div use:dndzone={{ items: tiles, type: 'tile' }} on:consider={handleSort} on:finalize={handleDrop}>
  {#each tiles as tile (tile.id)}
    <TileComponent {tile} />
  {/each}
</div>
```

## TypeScript

- tsconfig extends SvelteKit auto-generated config: `strict: true`, `moduleResolution: "bundler"`
- Path aliases: `$lib` → `src/lib/` (handled by SvelteKit, not tsconfig)
- `import type` is good practice for type-only imports — `import type { PageData } from './$types'`
- `allowJs: true`, `checkJs: true` — JS files are type-checked too

## Svelte 5 Rules

- **Always use runes**: `$props()`, `$state()`, `$derived()`, `$effect()`, `$bindable()`
- **Never use**: `export let`, `createEventDispatcher`, `$$props`, `$$restProps`, `$:` reactive statements
- **Stores**: Legacy stores exist in `$lib/stores/` — do NOT create new stores; use runes instead
- **Event handling**: Use callback props or Svelte 5 event attributes, not `createEventDispatcher`
- **Children**: Use `{@render children?.()}` snippet pattern, not `<slot />`

## Static Adapter Constraints

Since the app uses `adapter-static`:
- All routes must work client-side (no server-only load functions that run at request time)
- `+page.ts` load functions run at build time during prerendering
- Dynamic data must be fetched client-side via `api.ts`
- Use `export const ssr = false` or `export const prerender = false` where needed
- **Form actions (`use:enhance`, `+page.server.ts` actions) are NOT available** with adapter-static — use client-side fetch via `api.ts` instead
- **No `+server.ts` API routes** at runtime — the backend is a separate Hono server

## Svelte 5 Snippets

Use `{#snippet}` for reusable template fragments within a component:

```svelte
{#snippet tileDisplay(tile)}
  <div class="tile" data-letter={tile.char}>
    <span>{tile.char}</span>
    <span class="score">{TILE_SCORE[tile.char.toUpperCase()]}</span>
  </div>
{/snippet}

<!-- Reuse it -->
{@render tileDisplay(myTile)}
```

For cross-component composition, pass snippets as props (not `<slot />`):
```svelte
<!-- Parent -->
<MyComponent>
  {#snippet header()}
    <h2>Title</h2>
  {/snippet}
</MyComponent>

<!-- MyComponent.svelte -->
<script lang="ts">
  let { header }: { header: Snippet } = $props();
</script>
{@render header?.()}
```

## Testing

- **Unit tests**: `*.test.ts` or `*.svelte.test.ts` files, run with `vitest`
- **Client tests**: jsdom environment, use `@testing-library/svelte`
- **Server tests**: Node environment
- **E2E**: `e2e/` directory with Playwright
- Vitest config has 2 workspaces: `client` (jsdom) and `server` (node)

## Commands

```bash
cd packages/frontend
bun run dev          # Dev server (port 5173)
bun run build        # Build static site
bun run preview      # Preview built site (port 4173)
bun run check        # TypeScript check
bun run lint         # Prettier + ESLint
bun run test:unit    # Vitest
bun run test:e2e     # Playwright
```

## Pre-Completion Verification

Before considering work done, run these checks:

1. `bun run check` — TypeScript/Svelte type errors
2. `bun run build` — Ensure static build succeeds (catches SSR-dependent code)
3. `bun run test:unit -- --run` — Unit tests pass

If any step fails, fix the issue before finishing. A page that type-checks but doesn't build is broken.
