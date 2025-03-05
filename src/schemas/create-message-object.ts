import { z } from "@hono/zod-openapi";

export const createMessageObjectSchema = (exampleMessage = "Hello Hono!") => {
	return z
		.object({
			message: z.string(),
		})
		.openapi({
			example: {
				message: exampleMessage,
			},
		});
};
