import { TObject, TSchema, TString } from "@sinclair/typebox";
import { TypeCheck } from "@sinclair/typebox/compiler";
import convertTypeBoxValidationErrors from "../../shared/utils/convertTypeBoxValidationErrors";

interface Validation {
  validator: TypeCheck<TObject | TString>;
  schema: TSchema;
}

class ValidationError extends Error {
  details: Record<string, unknown>;

  constructor(details: Record<string, unknown>) {
    super('');
    this.name = "VALIDATION_ERROR";
    this.details = details;
  }
}

export default function checkData(validation: Validation, data: unknown) {
  if (validation.validator.Check(data) === false) {
    const errors = [...validation.validator.Errors(data)];
    throw new ValidationError(convertTypeBoxValidationErrors(errors));
  }
}


// interface ValidateConfig {
//   validation?: {
//     validator: TypeCheck<TObject>;
//     schema: TSchema;
//   };
//   uniqueness?: boolean;
// }

// export default class Validate {
//   constructor(private config: ValidateConfig) {
//     this.config = config;
//   }

//   private checkData(data: unknown) {
//     if (this.config.validation && this.config.validation.validator.Check(data) === false) {
//       throw new ValidationError("data", this.config.validation.schema, data);
//     }
//   }

//   private async checkUniqueConstraints(callback: Function, data: unknown) {
//     try {
//       return await callback(data);
//     } catch (error: unknown) {
//       if (error instanceof Error && error.message === "UNIQUE_CONSTRAINT_VIOLATED") {
//         throw new ValidationError("UNIQUE_CONSTRAINT_VIOLATED", TUniqueSchema, data);
//       }
//       throw error;
//     }
//   }

//   async check(data: unknown, callback = async (d: unknown) => d) {
//     this.checkData(data);
//     if (this.config.uniqueness) {
//       return this.checkUniqueConstraints(callback, data);
//     }
//     return await callback(data);
//   }
// }