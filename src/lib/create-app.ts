import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";

import type { Env } from "@/lib/types";

import { authMiddleware } from "@/middleware/auth";
import { defaultHook } from "@/middleware/default-hook";
import { notFound } from "@/middleware/not-found";
import { onError } from "@/middleware/on-error";
import { serveEmojiFavicon } from "@/middleware/serve-emoji-favicon";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { timeout } from "hono/timeout";

export function createRouter() {
  return new OpenAPIHono<Env>({
    strict: false,
    defaultHook,
  });
}

export function createApp() {
  const app = createRouter();

  app.use(timeout(5000));

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );

  app.use(serveEmojiFavicon("🐇"));
  app.use(logger());
  app.use(authMiddleware);
  app.use(prettyJSON());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
