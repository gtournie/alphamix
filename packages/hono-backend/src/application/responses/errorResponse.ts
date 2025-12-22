import { error } from 'elysia';

type ErrorCode = 
  "INTERNAL_SERVER_ERROR" | 
  "VALIDATION_ERROR" |
  "UNIQUE_CONSTRAINT_ERROR" |
  "NOT_FOUND" |
  "NOT_AUTHORIZED";

export default function errorResponse(statusCode: number, errorCode: ErrorCode, details?: unknown) {
  return error(
    statusCode,
    {
      success: false,
      error: {
        code: errorCode,
        details
      }
    }
  );
}