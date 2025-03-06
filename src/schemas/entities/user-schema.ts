import { users } from "@/db/schemas/users";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectedUserSchema = createSelectSchema(users)
	.extend({
		phone: z.string().nullable(),
	})
	.omit({
		password: true,
	});

export const insertUserSchema = createInsertSchema(users)
	.extend({
		name: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(6),
		phone: z.string().optional(),
		role: z.string().default("receptionist"),
	})
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		isActive: true,
	});

export const patchUserSchema = insertUserSchema.partial().omit({
	password: true,
});
