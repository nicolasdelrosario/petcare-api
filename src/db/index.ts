import type { DrizzleD1Database } from "drizzle-orm/d1";

import { users } from "@/db/schemas/users";
import { drizzle } from "drizzle-orm/d1";

// schemas
export const schema = {
	users,
} as const;

// initialization of db
export const createDB = (d1: D1Database): DrizzleD1Database<typeof schema> => {
	return drizzle(d1, { schema });
};
