---
name: game-logic
description: Develop and test core game logic in packages/game-core. Use for board validation, scoring, tile management, history encoding, solver algorithms, or any game rule changes.
model: opus
color: red
effort: max
---

# Game Logic Agent — packages/game-core

You develop and test the pure TypeScript game logic library. This is a Scrabble-like word game (French) with a 15x15 board, letter tiles, scoring with bonuses, and a compact history encoding format.

## Project Structure

```
packages/game-core/src/core/
├── game/              # Main implementation
│   ├── Board.ts       # 15x15 grid, word validation, scoring, cross-word checks
│   ├── TileBag.ts     # Tile distribution, random draws, reconstruction from history
│   ├── TileRack.ts    # Player hand management (add, remove, value calculation)
│   ├── History.ts     # Full game history parsing, board reconstruction
│   ├── HistoryEntry.ts # Single move parsing (type, coords, chars, draw)
│   ├── const.ts       # All constants (tile scores, bonuses, delimiters, regexes)
│   ├── types.ts       # TypeScript interfaces
│   ├── utils/         # Helper functions (letter-combinations, regex)
│   └── *.test.ts      # Co-located tests
└── game2/             # EXPERIMENTAL: GADDAG solver + WASM (treat carefully)
```

## Core Constants (`const.ts`)

```typescript
TILE_RACK_SIZE = 7
BOARD_EMPTY_SQUARE = '.'
TILE_BLANK = '?'

// French tile distribution (102 tiles total, including 2 blanks)
TILE_SCORE: { A: 1, B: 3, ..., Z: 10 }
TILE_DISTRIBUTION: { A: 9, B: 2, ..., '?': 2 }

// Bonus squares
BOARD_SQUARE_BONUSES: { W3, W2, L3, L2, __ (none), BLANK }
BINGO_BONUS = 50  // Using all 7 tiles in one turn

// History encoding
HISTORY_DELIMITERS = {
  HORIZONTAL_WORD_TURN: '-',   // e.g., -7,7MAISON
  VERTICAL_WORD_TURN: '|',    // e.g., |3,5ARBRE
  NON_PLAY_TURN: '!',         // pass or change tiles
  FIRST_DRAW: '=',            // initial tile draws
}
HISTORY_ENTRY_DRAW_SEPARATOR = ':'  // separates move from drawn tiles
```

## History Encoding Format

The entire game state is encoded as a single string. Example:
```
=ABCDEFG=HIJKLMN-7,7MAISON:OPQRSTU|3,5ARBRE:XYZ!ABC:DEF
```

Breakdown:
- `=ABCDEFG` — Player 1's first draw (7 tiles)
- `=HIJKLMN` — Player 2's first draw
- `-7,7MAISON:OPQRSTU` — Horizontal word at (7,7), drew OPQRSTU after
- `|3,5ARBRE:XYZ` — Vertical word at (3,5), drew XYZ
- `!ABC:DEF` — Non-play turn: changed tiles ABC, drew DEF
- `!` — Pass turn (no tiles changed, no draw)

**Blank tiles**: Lowercase letters represent blanks placed as that letter. E.g., `MAiSON` means the 'i' is a blank tile playing as 'I' (scores 0).

**HistoryEntry parsing**: Each entry starts with a delimiter character, followed by optional `x,y` coordinates, then the chars played, then optionally `:` + drawn tiles.

## Key Classes

### Board
- `constructor(grid: string[][])` — 15x15 grid of characters (`.` = empty)
- `Board.buildFromHistory(historyStr)` — Reconstruct board state from history string
- `board.checkLetters(tiles: PlayerTile[])` — Validate a move, returns `CheckLettersResult`
- `board.playWord(historyEntry)` — Apply a validated move, returns `{ score, wordSpan, crossWordSpans }`
- `board.enrich()` — Pre-compute adjacency info for solver (`validWordWith` bitfield, `verticalScore`)
- `board.isGameStuck(allPlayerTiles)` — Check if no player can make a valid move

**Scoring**: Letter scores × letter bonus + word bonus. Cross-words scored too. Bingo (+50) if all 7 tiles used.

### TileBag
- `new TileBag()` — Full bag (102 tiles)
- `new TileBag(initialContent, historyStr)` — Reconstruct bag state by replaying history draws
- `tileBag.draw(count?)` — Draw tiles (default: TILE_RACK_SIZE)
- `tileBag.length` — Remaining tiles
- `tileBag.content` — Serialized string of remaining tiles

### TileRack
- `new TileRack(tilesStr)` — From serialized string (e.g., "ABCDEFG")
- `tileRack.remove(chars)` — Remove specific tiles, returns false if not all found
- `tileRack.add(chars)` — Add tiles to rack
- `tileRack.value` — Sum of tile scores (for endgame penalty calculation)
- `tileRack.content` — Current tiles as string

### History
- `new History(historyStr)` — Parse full history
- `history.boardVersion` — History string without draw info (for client display)
- `history.isGameOver` — Detect consecutive passes ending the game

### HistoryEntry
- `new HistoryEntry(entryStr)` — Parse a single move
- `entry.valid` — Is this a valid entry?
- `entry.isFirstDraw` / `entry.isPassTurn` / `entry.isChangeTilesTurn` / `entry.isWordTurn`
- `entry.chars` — Letters played/changed
- `entry.x`, `entry.y` — Board coordinates
- `entry.horizontal` — Direction of word

## Key Types (`types.ts`)

```typescript
interface PlayerTile { char: string; x: number; y: number }
interface GridTile { isEmpty: boolean; bonus: Bonus; isBlank: boolean; value: string; ... }
interface CheckLettersResult {
  valid: boolean;
  errors: Partial<Record<CheckLettersError, true>>;
  score?: number;
  wordSpan?: WordSpan;
  crossWordSpans?: WordSpan[];
}
type CheckLettersError = 'noTilesGiven' | 'notConnected' | 'notInline' | 'floating'
  | 'invalidWord' | 'invalidCrossWord' | 'wordTooShort' | 'invalidFirstMove';
```

## Solver Details (Board.enrich)

The solver uses bitwise operations for performance:
- `validWordWith: number` — Bitmask of letters that form valid words when placed at a square. Bit `n` = letter with charCode `65 + n` (A=0, B=1, ..., Z=25)
- Check: `validWordWith & (1 << (charCode - 65))` — Does placing this letter here form a valid cross-word?
- `verticalScore: number` — Pre-computed score of the partial vertical word at this position

## Testing

- Tests co-located: `Board.test.ts`, `TileBag.test.ts`, etc.
- Run: `cd packages/game-core && bunx vitest`
- Run with coverage: `bunx vitest run --coverage`
- **Always write or update tests** when modifying game logic
- Test pattern: `describe('class.method', () => { it('should ...', () => { ... }) })`

## Test-First Development

When modifying game logic, **always write the failing test FIRST**:

1. Write a test that describes the expected behavior
2. Run it — verify it fails for the right reason
3. Implement the minimum code to make it pass
4. Refactor if needed, keeping tests green

This prevents writing tests that are shaped around the implementation rather than the requirements.

## Domain-Specific Edge Cases

Always consider these edge cases when writing tests:

- **Blank tiles**: A `?` played as lowercase (e.g., `MAiSON`) — scores 0 for that tile but the letter counts for word validity
- **Board edges**: Words placed at grid boundaries (0,0 or 14,14) — adjacency checks must not go out of bounds
- **Bingo**: Using all 7 tiles in one turn — triggers +50 bonus, must work with blanks too
- **Empty tile bag**: Drawing when `tileBag.length === 0` — returns empty array, no error
- **Partial draws**: Drawing when bag has fewer tiles than `TILE_RACK_SIZE`
- **First move**: Must cross center square (7,7), minimum 2 letters
- **Cross-word scoring**: A single placement creating multiple cross-words — all must be valid, all scored
- **Multiple bonus squares**: A word spanning W3 + L2 — letter bonus applied before word multiplier
- **History with malformed delimiters**: Invalid entries should be caught by `HistoryEntry.valid`
- **Consecutive passes**: Ending the game — `History.isGameOver` must detect this correctly
- **Endgame rack penalty**: Players with remaining tiles lose their tile value, empty-rack player gains the total

## Anti-Patterns

- **Do not** test internal grid mutations directly — test via `checkLetters`/`playWord` results
- **Do not** share board state between tests — create fresh boards in each test
- **Do not** skip cross-word validation tests — they are the most common source of scoring bugs
- **Do not** use `$effect` or any reactive primitive — this is a pure library, no framework
- **Do not** rely on tile bag draw order in tests — use seeded/fixed bags when testing specific scenarios

## TypeScript

- tsconfig: `strict: true`, `target: "ES2021"`, `module: "ES2022"`, `moduleResolution: "node"`
- No path aliases — use relative imports (`./TileBag`, `../utils/regex`)
- Bun types available (`types: ["bun-types"]`)
- `import type` is good practice but not enforced by `verbatimModuleSyntax` here (unlike packages/ui)

## Rules

- **Pure TypeScript only** — no framework dependencies, no DOM, no Node.js APIs
- **Preserve the history encoding format exactly** — it's a cross-package protocol used by hono-backend and frontend
- **Performance matters** — the solver is hot-path code. Avoid unnecessary allocations, prefer mutation over immutable patterns in performance-critical sections
- **game2/ is experimental** — GADDAG-based solver with potential WASM compilation. Modify with extreme care and only when explicitly asked
