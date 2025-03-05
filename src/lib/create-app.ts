import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";

import type { Bindings } from "@/lib/types";

import { defaultHook } from "@/middleware/default-hook";
import { notFound } from "@/middleware/not-found";
import { onError } from "@/middleware/on-error";
import { serveEmojiFavicon } from "@/middleware/serve-emoji-favicon";

export function createRouter() {
	return new OpenAPIHono<{ Bindings: Bindings }>({
		strict: false,
		defaultHook,
	});
}

export function createApp() {
	const app = createRouter();

	app.use(serveEmojiFavicon("🐇"));
	app.use(logger());

	app.notFound(notFound);
	app.onError(onError);

	return app;
}
