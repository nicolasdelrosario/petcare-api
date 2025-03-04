import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

export type AppBindings = {
	DB: D1Database;
	JWT_SECRET: string;
	NODE_ENV: string;
};

export type Env = {
	Bindings: AppBindings;
};

export type AppOpenApi = OpenAPIHono<{ Bindings: AppBindings }>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, Env>;
