import { PrismaClientKnownRequestError } from "generated/prisma-client-js/runtime/client";

class NotFoundError extends Error {
  constructor() {
    super('');
    this.name = "NOT_FOUND";
  }
}

export default async function handleNotFound(callback: Function) {
  try {
    let resource = await callback();
    if (!resource) throw new NotFoundError();
    return resource;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      // P2025: resource not found
      throw new NotFoundError();
    }
    throw error;
  }
}