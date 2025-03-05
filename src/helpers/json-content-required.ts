import type { ZodSchema } from "@/helpers/types";

import { jsonContent } from "@/helpers/json-content";

export const jsonContentRequired = <T extends ZodSchema>(
	schema: T,
	description: string,
) => {
	return {
		...jsonContent(schema, description),
		required: true,
	};
};
