import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

export type Bindings = {
	DB: D1Database;
	JWT_SECRET: string;
	NODE_ENV: string;
};

export type AppOpenApi = OpenAPIHono<{ Bindings: Bindings }>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
	R,
	{ Bindings: Bindings }
>;
