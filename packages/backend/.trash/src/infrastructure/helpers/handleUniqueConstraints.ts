import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class UniqueConstraintError extends Error {
  fields: string[];

  constructor(fields: string[]) {
    super('');
    this.name = "UNIQUE_CONSTRAINT_ERROR";
    this.fields = fields;
  }
}

export default async function handleUniqueConstraints(callback: Function) {
  try {
    return await callback();
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      console.log(error.message)
      // P2002: unicity constraint violated
      const fields = error.meta?.target as string[] || [];
      throw new UniqueConstraintError(fields);
    }
    throw error;
  }
}