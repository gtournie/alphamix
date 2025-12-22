import { Schema } from "shared/utils/validator";

class ValidationError extends Error {
  details: Record<string, unknown>;

  constructor(details: Record<string, unknown>) {
    super('');
    this.name = "VALIDATION_ERROR";
    this.details = details;
  }
}

export default function checkData(validator: ReturnType<typeof Schema.compile>, data: unknown) {
  const { valid, errors } = validator(data);
  if (valid === false) throw new ValidationError(errors);
}
