import { createSelectSchema } from "drizzle-zod";
import { workspaces } from "@/db/schemas/workspaces";
import { z } from "zod";

export const selectedWorkspaceSchema = createSelectSchema(workspaces).extend({
	location: z.string().nullable(),
});

export const insertWorkspaceSchema = createSelectSchema(workspaces)
	.extend({
		name: z.string().min(3),
		slug: z.string().min(3),
		location: z.string().optional(),
	})
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		isActive: true,
	});

export const patchWorkspaceSchema = insertWorkspaceSchema.partial();
