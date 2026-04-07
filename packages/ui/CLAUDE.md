# UI Package — Workspace Instructions

This is the `@alphamix/ui` design system package built with **Svelte 5**, **tailwind-variants**, **bits-ui**, and **Storybook 10**.

## Automatic scope validation

For **every non-trivial task**, follow this protocol:

**Before starting:** create a vigil checkpoint with `vigil_save` (name it after the task, e.g. `"before-button-refactor"`).

**After finishing:** invoke the `scope-guard` agent with the original request and the checkpoint name.

Act on its verdict before closing the task:
- `✅ On scope` → proceed
- `⚠️ Review needed` → fix gaps or surface extras to the user
- `🚨 Action required` → stop and ask the user before doing anything else

## Vigil checkpoint management

When creating a checkpoint with `vigil_save`:
- If checkpoint slots are full (e.g. 5/5), **automatically delete the oldest checkpoint first** using `vigil_delete`
- Then create the new checkpoint
- Do not ask the user for permission to delete old checkpoints — just handle it automatically
- This keeps the checkpoint system from blocking tasks due to capacity limits

## Automatic code review

Whenever a component file (`.svelte`) in `src/lib/components/ui/` is created or modified, use the `storybook-review` sub-agent to perform a code review before considering the task done. Run it **after** scope-guard passes.

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

## Storybook

- Dev server: `bun run dev` (port 6006)
- Stories location: `src/**/*.stories.svelte`
- Every variant must have a dedicated Story, plus an `autodocs` tag
