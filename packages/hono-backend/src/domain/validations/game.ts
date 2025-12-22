// import { FormatRegistry, Type } from "@sinclair/typebox";
// import { TypeCompiler } from "@sinclair/typebox/compiler";
// import { HistoryEntry } from "game-core/src/core/game/HistoryEntry";
import { Schema } from "shared/utils/validator";

const createGameSchema = Schema.Object({
  userIds: Schema.Array(Schema.String({ format: "uuid" }))
});

export const GameCreateValidation = {
  schema: createGameSchema,
  validator: Schema.compile(createGameSchema)
};


// FormatRegistry.Set('history-entry', (value) => new HistoryEntry(value).valid);

// const historyEntrySchema = Type.String({
//   format: 'history-entry'
// });

// export const HistoryEntryValidation = { schema: historyEntrySchema, validator: TypeCompiler.Compile(historyEntrySchema) }