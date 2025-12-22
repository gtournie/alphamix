import { FormatRegistry, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { HistoryEntry } from "game-core/src/core/game/HistoryEntry";

const createSchema = Type.Object({
  userCount: Type.Number({ min: 2, max: 4 }),
});

const updateSchema = Type.Partial(createSchema)

export const GameCreateValidation = { schema: createSchema, validator: TypeCompiler.Compile(createSchema) };

export const GameUpdateValidation = { schema: updateSchema, validator: TypeCompiler.Compile(updateSchema) };



FormatRegistry.Set('history-entry', (value) => new HistoryEntry(value).valid);

const historyEntrySchema = Type.String({
  format: 'history-entry'
});

export const HistoryEntryValidation = { schema: historyEntrySchema, validator: TypeCompiler.Compile(historyEntrySchema) }