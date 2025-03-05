import type { z } from "@hono/zod-openapi";

export type ZodSchema =
	| z.ZodUnion<[z.ZodTypeAny, ...z.ZodTypeAny[]]>
	| z.AnyZodObject
	| z.ZodArray<z.AnyZodObject>;
