import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";

import { INTERNAL_SERVER_ERROR, OK } from "@/constants/http-status-codes";

export const onError: ErrorHandler = (err, c) => {
  const currentStatus =
    "status" in err ? (err.status as StatusCode) : c.res.status;

  const statusCode =
    currentStatus !== OK ? currentStatus : INTERNAL_SERVER_ERROR;

  // only show stack trace in development
  const isProd = c.env && c.env.NODE_ENV === "production";

  return c.json(
    {
      message: err.message,
      stack: isProd ? undefined : err.stack,
    },
    statusCode as ContentfulStatusCode,
  );
};
