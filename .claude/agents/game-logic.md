---
name: game-logic
description: Develop and test core game logic in packages/game-core/src2. Use for solver algorithms, locale data, DAWG/GADDAG compression, tile management, or any game rule changes.
model: opus
color: red
effort: max
tools:
  - Read
  - Edit
  - Write
  - Glob
  - Grep
  - Bash
  - Agent
---

# Game Logic Agent — packages/game-core/src2

You develop and test the pure TypeScript game logic library. This is a Scrabble-like word game engine with a 15x15 board, letter tiles, scoring with bonuses, and a GADDAG-based solver.

## Project Structure

```
packages/game-core/
├── dictionaries/
│   ├── source/                # Source dicts: {locale}.js (Map<string, string>)
│   ├── dawg/                  # DAWG binaries: {locale}.bin (intermediate)
│   └── gaddag/                # GADDAG binaries: {locale}.bin (used by solver)
├── scripts/
│   ├── compress-source-to-dawg.ts    # source → DAWG
│   ├── compress-dawg-to-gaddag.ts    # DAWG → GADDAG
│   └── test-solver.ts                # Manual solver test
├── src2/core/game/
│   ├── const.ts               # Game constants (SEPARATOR_ID, BONUS_GRID, etc.)
│   ├── types.ts               # TypeScript interfaces (Move, CellConstraint, Bonus, etc.)
│   ├── solver.ts              # GADDAG solver (Board class with solve/goLeft/goRight)
│   ├── locale/
│   │   ├── locale-data.ts     # LocaleData class (alphabet, findDataChild, tile scores)
│   │   └── tile-configs.ts    # Static tile scores & distributions per locale
│   ├── utils/
│   │   └── dawg-to-gaddag.ts  # DAWG→GADDAG conversion via WASM
│   └── wasm/
│       ├── gaddag.js          # Emscripten WASM wrapper
│       ├── gaddag.wasm        # Compiled C WASM binary
│       ├── gaddag_converter.c # C source
│       └── package.json       # Emscripten build config
```

## Data Flow

```
[Build time — two scripts]
dictionaries/source/fr.js → compress-source-to-dawg.ts → dictionaries/dawg/fr.bin
                                                                    ↓
                              compress-dawg-to-gaddag.ts → dictionaries/gaddag/fr.bin

[Runtime]
gaddag/fr.bin → LocaleData (parses header, holds scores) → solver.ts (finds moves)
```

## Binary Format

DAWG and GADDAG share the same Uint32Array encoding:

**Header**: `[alphabetLen][char0][char1]...[charN][totalGaddagNodes]`

**Node encoding** (32-bit):
```
[charId:6bits][eow:1bit][hasMore:1bit][pointer:24bits]
```
- `charId`: letter index in alphabet (0 = separator `+`)
- `eow`: end-of-word flag
- `hasMore`: sibling exists at next index
- `pointer`: child node index (max 16M nodes)

## Key Constants (`const.ts`)

- `SEPARATOR_ID = 0` — GADDAG pivot separator
- `EMPTY_ID = -1` — empty board cell
- `BLANK_ID = -2` — blank/joker tile in rack
- `TILE_RACK_SIZE = 7`
- `BINGO_BONUS = 50`
- `BONUS_GRID` — 15x15 standard bonus layout (W3, W2, L3, L2)

## Running

- Compress source → DAWG: `cd packages/game-core && bun run compress:dawg`
- Convert DAWG → GADDAG: `cd packages/game-core && bun run compress:gaddag`
- Manual solver test: `cd packages/game-core && bun run scripts/test-solver.ts`
- Tests: `cd packages/game-core && bunx vitest`

## Rules

- **Pure TypeScript only** — no framework dependencies, no DOM
- **Performance matters** — the solver is hot-path code. Avoid unnecessary allocations, prefer mutation over immutable patterns in performance-critical sections
- **Locale files** group all locale-aware code — tile configs, LocaleData
- **Dictionary pipeline**: `dictionaries/source/{locale}.js` → `dictionaries/dawg/{locale}.bin` → `dictionaries/gaddag/{locale}.bin`
- **Dictionary source format**: `{locale}.js` exporting a `Map<string, string>` (word → definition)

## Legacy Reference

The previous implementation lives in `src/core/game2/` (not deleted). The legacy agent definition is at `.claude/agents/game-logic-legacy.md`. Consult these if you need historical context, but do NOT modify them.
