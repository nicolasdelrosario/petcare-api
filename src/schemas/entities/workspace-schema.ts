import { workspaces } from "@/db/schemas/workspaces";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectedWorkspaceSchema = createSelectSchema(workspaces).extend({
	description: z.string().nullable(),
	location: z.string().nullable(),
});

export const insertWorkspaceSchema = createSelectSchema(workspaces)
	.extend({
		name: z.string().min(3),
		slug: z.string().min(3),
		description: z.string().min(10).max(500).optional(),
		location: z.string().optional(),
	})
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		isActive: true,
	});

export const patchWorkspaceSchema = insertWorkspaceSchema.partial();

export type SelectWorkspaceSchema = z.infer<typeof selectedWorkspaceSchema>;
export type InsertWorkspaceSchema = z.infer<typeof insertWorkspaceSchema>;
export type PatchWorkspaceSchema = z.infer<typeof patchWorkspaceSchema>;
