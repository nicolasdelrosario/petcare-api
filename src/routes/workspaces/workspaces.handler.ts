import type { AppRouteHandler } from "@/lib/types";
import type {
	CreateRoute,
	GetOneRoute,
	ListRoute,
	PatchRoute,
	RemoveRoute,
} from "@/routes/workspaces/workspaces.routes";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import { createDB } from "@/db";
import { workspaces } from "@/db/schemas/workspaces";
import { and, eq } from "drizzle-orm";

export const list: AppRouteHandler<ListRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const workspace = await db.query.workspaces.findMany({
		where(fields, operators) {
			return operators.eq(fields.isActive, true);
		},
	});

	return c.json(workspace);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const workspace = await c.req.json();
	const { slug } = workspace;

	if (await isSlugTaken(db, slug)) {
		return c.json(
			{ message: HttpStatusPhrases.CONFLICT },
			HttpStatusCodes.CONFLICT,
		);
	}

	const [inserted] = await db.insert(workspaces).values(workspace).returning();
	return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const { id } = c.req.valid("param");
	const workspace = await db.query.workspaces.findFirst({
		where(fields, operators) {
			return operators.and(
				operators.eq(fields.id, id),
				operators.eq(fields.isActive, true),
			);
		},
	});

	if (!workspace) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.json(workspace, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const { id } = c.req.valid("param");
	const updates = c.req.valid("json");
	const { slug } = updates;

	if (slug && (await isSlugTaken(db, slug))) {
		return c.json(
			{ message: HttpStatusPhrases.CONFLICT },
			HttpStatusCodes.CONFLICT,
		);
	}

	const [workspace] = await db
		.update(workspaces)
		.set(updates)
		.where(and(eq(workspaces.id, id), eq(workspaces.isActive, true)))
		.returning();

	if (!workspace) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.json(workspace, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const { id } = c.req.valid("param");
	const [deleted] = await db
		.delete(workspaces)
		.where(and(eq(workspaces.id, id), eq(workspaces.isActive, true)))
		.returning();

	if (!deleted) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.body(null, HttpStatusCodes.NO_CONTENT);
};

async function isSlugTaken(db: ReturnType<typeof createDB>, slug: string) {
	return await db.query.workspaces.findFirst({
		where(fields, operators) {
			return operators.eq(fields.slug, slug);
		},
	});
}
