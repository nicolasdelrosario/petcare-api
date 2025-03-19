import type { ZodSchema } from "@/helpers/types";

import { oneOf } from "@/helpers/one-of";

export const jsonContentOneOf = <T extends ZodSchema>(
  schemas: T[],
  description: string,
) => {
  return {
    content: {
      "application/json": {
        schema: {
          oneOf: oneOf(schemas),
        },
      },
    },
    description,
  };
};
