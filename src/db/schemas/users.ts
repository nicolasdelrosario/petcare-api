import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { workspaces } from "./workspaces";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	workspaceId: integer("workspace_id")
		.references(() => workspaces.id)
		.notNull(),
	phone: text("phone").unique(),
	role: text("role", {
		enum: ["admin", "vet", "receptionist", "owner"],
	}).notNull(),
	createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`),
	isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
