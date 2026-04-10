# UI Package — Workspace Instructions

This is the `@alphamix/ui` design system package built with **Svelte 5**, **tailwind-variants**, **bits-ui**, and **Storybook 10**.

## Automatic code review

Whenever a component file (`.svelte`) in `src/lib/components/ui/` is created or modified, use the `storybook-review` sub-agent to perform a code review before considering the task done.

Invoke it with:
```
Use the storybook-review agent to review <path/to/component.svelte>
```

## Conventions

- Variants use `tailwind-variants` (`tv`) — never `cva`, never inline ternaries
- Class merging via `cn()` from `$lib/utils.js`
- Props via `$props()`, reactive state via `$state`/`$derived`, no Options API
- Root element has `data-slot="component-name"`
- Ref exposed as `ref = $bindable(null)` with `bind:this={ref}` on root
- `...restProps` spread on root element
- Type: `WithElementRef<HTMLXxxAttributes>` from `$lib/utils.js`
- Stories: `.stories.svelte` alongside the component, using `@storybook/addon-svelte-csf` (`defineMeta` + `Story` + `{#snippet template(args)}`). **Never use `{#snippet children}`** — the addon transform specifically looks for `template` and silently produces a 404 if `children` is used instead.
- **Always use `<script module lang="ts">`**, never `<script module>` without `lang="ts"`. Without it, esbuild's dep scanner fails on any TypeScript syntax (`import type`, `type X =`, etc.) in the module script, causing `Failed to scan for dependencies` errors in the Storybook dev server.
- Fixed package versions only (no `^` or `~` in package.json)

## Regenerating shadcn-svelte components

**ALWAYS use the CLI, NEVER fetch the API directly.**

When regenerating components from the shadcn-svelte registry:
```bash
npx shadcn-svelte add <component-name> --overwrite
```

**Why:** The CLI reads `components.json`, detects `"style": "mira"`, and applies style transformations (e.g., `text-xs` for Mira). Fetching the API directly bypasses these transformations and results in incorrect styling.

Example: `text-xs` in Mira becomes `text-sm` if fetched from API without CLI processing.

## Code review workflow

The `storybook-review` agent may suggest changes after reviewing a file. However:

- **Never apply a reviewer suggestion that contradicts code explicitly provided by the user** (e.g. pasted from official docs). Instead, surface the conflict to the user and let them decide.
- Reviewer suggestions about conventions, accessibility, or best practices are welcome — but they do not override the user's intent.

## Accessibilité (axe-core)

`@storybook/addon-a11y` exécute axe-core sur chaque story dans `bun run test` avec `a11y.test: 'error'`. Toute violation fait fail les tests.

Règles à toujours respecter dans les composants **et** les stories :

- **Boutons icône** (`size="icon"`, `icon-xs`, etc.) → `aria-label` obligatoire
- **Triggers** (`AlertDialog.Trigger`, `Dialog.Trigger`, etc.) → utiliser `{#snippet child({ props })}` pour éviter le button-in-button (nested-interactive)
- **Slider** → toujours passer `thumbAriaLabel` (string ou `(index: number) => string`)
- **Progress** → `aria-label` ou `aria-labelledby`
- **Switch / Checkbox sans `<label>` englobant** → `aria-labelledby` vers l'id du label visible
- **Combobox trigger** (`role="combobox"`) → `aria-label` sur le Button/div
- **InputOTP** → `aria-label` sur `InputOTP.Root`
- **NativeSelect** → `aria-label` ou `<label>` associé
- **`<th>` vide** (ex. colonne checkbox) → `<span class="sr-only">…</span>`
- **`<dl>`** → pas de `<Separator>` comme enfant direct (invalide HTML)
- **`aria-label` sur `<span>`/`<div>`** → nécessite `role` explicite (ex. `role="img"`)
- **`text-muted-foreground`** → ne jamais ajouter d'opacité (`/50`, `/30`…) car le token est calibré pour 4.5:1 sur `bg-muted`
- **Calendar/RangeCalendar headers** → `role="presentation"` sur le `<header>` (évite landmark-banner-is-top-level)

## Storybook

- Dev server: `bun run dev` (port 6006)
- Stories location: `src/**/*.stories.svelte`
- Every variant must have a dedicated Story, plus an `autodocs` tag

## Storybook tests — `get_first_child` / double Svelte instance

If tests fail with `TypeError: Cannot read properties of undefined (reading 'call')` at `get_first_child`, the cause is **two Svelte runtime instances** loaded simultaneously: one inlined in the Storybook dep cache, one loaded directly by Vite for packages excluded from optimization.

**Root cause:** Vite pre-bundles packages into chunks (`node_modules/.cache/storybook/.../sb-vitest/deps/`). If a new dep is added or an import path changes, the cache for that dep is rebuilt with a new hash while old chunks remain. Both hashes get loaded → two Svelte instances → `first_child_getter` is `undefined` on one of them.

**Fix (already applied in `vitest.config.ts` and `.storybook/main.ts`):**  
`@lucide/svelte` is excluded from Vite's dep optimization (`optimizeDeps.exclude`) so its `.svelte` files are always compiled inline by the Svelte plugin and share the same Svelte instance as the rest of the app.

**If the error recurs after adding a new icon library or Svelte package:**
1. Add the package to `optimizeDeps.exclude` in both `vitest.config.ts` and `.storybook/main.ts` → `viteFinal`
2. Delete the stale Storybook dep cache metadata to force a clean rebuild:
   ```bash
   rm node_modules/.cache/storybook/10.*/*/sb-vitest/deps/_metadata.json
   ```
3. Re-run `bun run test` — the cache rebuilds consistently on the first run, passes on the second.

**Do NOT use `optimizeDeps.force: true`** — it forces re-optimization on every start, which causes the Vitest runner itself to load from two different cache versions and breaks the test suite entirely.

## ⛔ Actions interdites

- **Ne JAMAIS** lancer de commandes git (push, reset, checkout, etc.) sans approbation explicite
- **Ne JAMAIS** exécuter de commandes Bash destructives
- **Ne JAMAIS** sortir du répertoire `/packages/ui`
- Toujours demander avant d'agir sur du code en dehors du scope