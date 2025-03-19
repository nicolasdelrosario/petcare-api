import type { Hook } from "@hono/zod-openapi";

import { UNPROCESSABLE_ENTITY } from "@/constants/http-status-codes";

// biome-ignore lint/suspicious/noExplicitAny: allows flexibility by making the hook reusable for any validation schema.
export const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        error: result.error,
      },
      UNPROCESSABLE_ENTITY,
    );
  }
};
