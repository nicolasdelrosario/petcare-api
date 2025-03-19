import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import { jsonContent } from "@/helpers/json-content";
import { jsonContentOneOf } from "@/helpers/json-content-one-of";
import { jsonContentRequired } from "@/helpers/json-content-required";
import {
	badRequestSchema,
	conflictSchema,
	forbiddenSchema,
	notFoundSchema,
	unauthorizedSchema,
} from "@/lib/constants";
import { createErrorSchema } from "@/schemas/create-error-schema";
import {
	insertWorkspaceSchema,
	patchWorkspaceSchema,
	selectedWorkspaceSchema,
} from "@/schemas/entities/workspace-schema";
import { IdParamsSchema } from "@/schemas/id-params";

const tags = ["Workspaces"];

export const list = createRoute({
	method: "get",
	path: "/workspaces",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			z.array(selectedWorkspaceSchema),
			"List of workspaces",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			unauthorizedSchema,
			"Unauthorized",
		),
		[HttpStatusCodes.FORBIDDEN]: jsonContent(forbiddenSchema, "Access denied"),
	},
});

export const create = createRoute({
	method: "post",
	path: "/workspaces",
	tags,
	request: {
		body: jsonContentRequired(insertWorkspaceSchema, "The workspace to create"),
	},
	responses: {
		[HttpStatusCodes.CREATED]: jsonContent(
			selectedWorkspaceSchema,
			"The created workspace",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			badRequestSchema,
			"Bad request error",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			unauthorizedSchema,
			"Unauthorized",
		),
		[HttpStatusCodes.FORBIDDEN]: jsonContent(forbiddenSchema, "Access denied"),
		[HttpStatusCodes.CONFLICT]: jsonContent(
			conflictSchema,
			"Slug already in use",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(insertWorkspaceSchema),
			"The validation error(s)",
		),
	},
});

export const getOneById = createRoute({
	method: "get",
	path: "/workspaces/{id}",
	tags,
	request: {
		params: IdParamsSchema,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			selectedWorkspaceSchema,
			"The requested workspace",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			unauthorizedSchema,
			"Unauthorized",
		),
		[HttpStatusCodes.FORBIDDEN]: jsonContent(forbiddenSchema, "Access denied"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			notFoundSchema,
			"Workspace not found",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdParamsSchema),
			"Invalid ID error",
		),
	},
});

export const patch = createRoute({
	method: "patch",
	path: "/workspaces/{id}",
	tags,
	request: {
		params: IdParamsSchema,
		body: jsonContentRequired(patchWorkspaceSchema, "The updated workspace"),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			selectedWorkspaceSchema,
			"The updated workspace",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			badRequestSchema,
			"Bad request error",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			unauthorizedSchema,
			"Unauthorized",
		),
		[HttpStatusCodes.FORBIDDEN]: jsonContent(conflictSchema, "Access denied"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			notFoundSchema,
			"Workspace not found",
		),
		[HttpStatusCodes.CONFLICT]: jsonContent(
			conflictSchema,
			"Slug already in use",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
			[
				createErrorSchema(patchWorkspaceSchema),
				createErrorSchema(IdParamsSchema),
			],
			"The validation error(s)",
		),
	},
});

export const remove = createRoute({
	method: "delete",
	path: "/workspaces/{id}",
	tags,
	request: {
		params: IdParamsSchema,
	},
	responses: {
		[HttpStatusCodes.NO_CONTENT]: {
			description: "Workspace deleted",
		},
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			unauthorizedSchema,
			"Unauthorized",
		),
		[HttpStatusCodes.FORBIDDEN]: jsonContent(conflictSchema, "Access denied"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			notFoundSchema,
			"Workspace not found",
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdParamsSchema),
			"Invalid ID error",
		),
	},
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneByIdRoute = typeof getOneById;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
