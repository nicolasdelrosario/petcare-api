import type { AppRouteHandler } from "@/lib/types";
import type {
  CreateRoute,
  GetOneByIdRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from "@/routes/workspaces/workspaces.routes";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import { createDB } from "@/db";
import { workspaces } from "@/db/schemas/workspaces";
import { ROLE } from "@/permissions/roles";
import { and, eq } from "drizzle-orm";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const currentUser = c.get("jwtPayload");

  if (currentUser.role === ROLE.ADMIN) {
    const workspaces = await db.query.workspaces.findMany({
      where(fields, operators) {
        return operators.eq(fields.isActive, true);
      },
    });

    return c.json(workspaces, HttpStatusCodes.OK);
  }

  const workspaces = await db.query.workspaces.findMany({
    where(fields, operators) {
      return operators.and(
        operators.eq(fields.isActive, true),
        operators.eq(fields.id, currentUser.workspaceId),
      );
    },
  });

  return c.json(workspaces, HttpStatusCodes.OK);
};

export const getOneById: AppRouteHandler<GetOneByIdRoute> = async (c) => {
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

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const workspace = await c.req.json();

  if (workspace.slug && (await isSlugTaken(db, workspace.slug))) {
    return c.json(
      { message: HttpStatusPhrases.CONFLICT },
      HttpStatusCodes.CONFLICT,
    );
  }

  const [inserted] = await db.insert(workspaces).values(workspace).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const existingWorkspace = await db.query.workspaces.findFirst({
    where(fields, operators) {
      return operators.and(
        operators.eq(fields.id, id),
        operators.eq(fields.isActive, true),
      );
    },
  });

  if (!existingWorkspace) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  if (updates.slug && updates.slug !== existingWorkspace.slug) {
    if (await isSlugTaken(db, updates.slug)) {
      return c.json(
        { message: HttpStatusPhrases.CONFLICT },
        HttpStatusCodes.CONFLICT,
      );
    }
  }

  const [updated] = await db
    .update(workspaces)
    .set(updates)
    .where(eq(workspaces.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
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
