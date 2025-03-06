import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";

import type { Env } from "@/lib/types";

import { authMiddleware } from "@/middleware/auth";
import { defaultHook } from "@/middleware/default-hook";
import { notFound } from "@/middleware/not-found";
import { onError } from "@/middleware/on-error";
import { serveEmojiFavicon } from "@/middleware/serve-emoji-favicon";
import { cors } from "hono/cors";

export function createRouter() {
	return new OpenAPIHono<Env>({
		strict: false,
		defaultHook,
	});
}

export function createApp() {
	const app = createRouter();

	app.use(
		cors({
			origin: "*",
			credentials: true,
		}),
	);

	app.use(serveEmojiFavicon("🐇"));
	app.use(logger());
	app.use(authMiddleware);

	app.notFound(notFound);
	app.onError(onError);

	return app;
}
