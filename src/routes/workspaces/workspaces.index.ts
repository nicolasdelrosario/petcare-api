import { createRouter } from "@/lib/create-app";
import * as handlers from "./workspaces.handler";
import * as routes from "./workspaces.routes";
import { withPermission } from "@/permissions/create-protected-handler";
import {
	canCreate,
	canGetOneById,
	canList,
	canPatch,
	canDelete,
} from "@/permissions/workspace";

export const router = createRouter()
	.openapi(routes.list, withPermission(handlers.list, canList))
	.openapi(
		routes.getOneById,
		withPermission(handlers.getOneById, canGetOneById, (c) =>
			Number(c.req.valid("param").id),
		),
	)
	.openapi(routes.create, withPermission(handlers.create, canCreate))
	.openapi(
		routes.patch,
		withPermission(handlers.patch, canPatch, (c) =>
			Number(c.req.valid("param").id),
		),
	)
	.openapi(
		routes.remove,
		withPermission(handlers.remove, canDelete, (c) =>
			Number(c.req.valid("param").id),
		),
	);
