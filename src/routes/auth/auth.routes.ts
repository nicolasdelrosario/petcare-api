import { createRoute } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import { jsonContent } from "@/helpers/json-content";
import { jsonContentRequired } from "@/helpers/json-content-required";
import {
  badRequestSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "@/lib/constants";
import { selectedUserSchema } from "@/schemas/entities/user-schema";
import { selectedWorkspaceSchema } from "@/schemas/entities/workspace-schema";
import { loginResponseSchema, loginUserSchema } from "@/schemas/login-schema";

const tags = ["Auth"];

export const login = createRoute({
  method: "post",
  path: "/login",
  tags,
  request: {
    body: jsonContentRequired(loginUserSchema, "The user credentials"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      loginResponseSchema,
      "The user credentials",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Invalid credentials",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      badRequestSchema,
      "Invalid request structure or content",
    ),
  },
});

export const logout = createRoute({
  method: "post",
  path: "/logout",
  tags,
  responses: {
    [HttpStatusCodes.OK]: {
      description: "Logout successful",
    },
  },
});

export const getMe = createRoute({
  method: "get",
  path: "/me",
  tags,
  security: [{ bearerAuth: [] }, { cookieAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectedUserSchema.extend({
        workspace: selectedWorkspaceSchema,
      }),
      "The current user",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Invalid credentials",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found"),
  },
});

export type LoginRoute = typeof login;
export type LogoutRoute = typeof logout;
export type GetMeRoute = typeof getMe;
