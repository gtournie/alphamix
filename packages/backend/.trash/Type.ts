
import { TypeRegistry } from '@sinclair/typebox';
import { Kind } from '@sinclair/typebox'
import { JavaScriptTypeBuilder } from "@sinclair/typebox";

export const KindUnique = "Unique"

TypeRegistry.Set(KindUnique, () => false)

class ExtendedTypeBuilder extends JavaScriptTypeBuilder {
  Unique() {
    return super.Unsafe<Date>({ [Kind]: KindUnique })
  }
}

// SetErrorFunction((error) => {
//   if (error.errorType === ValueErrorType.Kind) {
//     if (error.schema[Kind] === KindDate) {
//       return `Must include valid value: ${error.value}`;
//     }
//   }
//   return DefaultErrorFunction(error);
// });

export const T = new ExtendedTypeBuilder();

export const TUniqueSchema = T.Unique();