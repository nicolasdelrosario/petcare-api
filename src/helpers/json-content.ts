import type { ZodSchema } from "@/helpers/types";

export const jsonContent = <T extends ZodSchema>(
	schema: T,
	description: string,
) => ({
	content: {
		"application/json": {
			schema,
		},
	},
	description,
});
