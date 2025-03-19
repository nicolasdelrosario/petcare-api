import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import { createMessageObjectSchema } from "@/schemas/create-message-object";

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};

export const notFoundSchema = createMessageObjectSchema(
  HttpStatusPhrases.NOT_FOUND,
);

export const unauthorizedSchema = createMessageObjectSchema(
  HttpStatusPhrases.UNAUTHORIZED,
);

export const conflictSchema = createMessageObjectSchema(
  HttpStatusPhrases.CONFLICT,
);

export const badRequestSchema = createMessageObjectSchema(
  HttpStatusPhrases.BAD_REQUEST,
);

export const forbiddenSchema = createMessageObjectSchema(
  HttpStatusPhrases.FORBIDDEN,
);
