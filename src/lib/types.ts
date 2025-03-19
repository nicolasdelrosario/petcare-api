import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

export type Bindings = {
  DB: D1Database;
  JWT_SECRET_KEY: string;
  NODE_ENV: string;
};

export type Env = {
  Bindings: Bindings;
};

export type AppOpenApi = OpenAPIHono<{ Bindings: Bindings }>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, Env>;
