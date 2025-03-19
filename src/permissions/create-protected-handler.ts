import * as HttpStatusCodes from "@/constants/http-status-codes";
import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import type { AppRouteHandler, Env } from "@/lib/types";
import type { SelectUserSchema } from "@/schemas/entities/user-schema";
import type { RouteConfig } from "@hono/zod-openapi";
import type { Context } from "hono";

type PermissionChecker = (
	user: SelectUserSchema,
	resourceId?: number,
) => boolean;

export function withPermission<R extends RouteConfig>(
	handler: AppRouteHandler<R>,
	permissionFn: PermissionChecker,
	getResourceId?: (c: Context<Env>) => number | undefined,
): AppRouteHandler<R> {
	return ((c, next) => {
		const currentUser = c.get("jwtPayload");

		if (!currentUser) {
			return c.json(
				{ message: HttpStatusPhrases.UNAUTHORIZED },
				HttpStatusCodes.UNAUTHORIZED,
			);
		}

		const resourceId = getResourceId ? getResourceId(c) : undefined;

		if (!permissionFn(currentUser, resourceId)) {
			return c.json(
				{ message: HttpStatusPhrases.FORBIDDEN },
				HttpStatusCodes.FORBIDDEN,
			);
		}

		return handler(c, next);
	}) as AppRouteHandler<R>;
}
