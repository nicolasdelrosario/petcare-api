import { z } from "@hono/zod-openapi";

import type { ZodSchema } from "@/helpers/types";

export const createErrorSchema = <T extends ZodSchema>(schema: T) => {
  const result = schema.safeParse(
    schema._def.typeName === z.ZodFirstPartyTypeKind.ZodArray ? [] : {},
  );

  const errorExample = result.success
    ? {
        issues: [],
        name: "ZodError",
      }
    : result.error;

  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            code: z.string(),
            path: z.array(z.union([z.string(), z.number()])),
            message: z.string().optional(),
          }),
        ),
        name: z.string(),
      })
      .openapi({
        example: errorExample,
      }),
  });
};
