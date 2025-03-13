import * as HttpStatusCodes from "@/constants/http-status-codes";
import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import { createDB } from "@/db";
import { users } from "@/db/schemas/users";
import { workspaces } from "@/db/schemas/workspaces";
import { verifyPassword } from "@/helpers/auth-helper";
import type { AppRouteHandler } from "@/lib/types";
import { sanitizeUser } from "@/utils/user-sanitization";
import { and, eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import type { GetMeRoute, LoginRoute, LogoutRoute } from "./auth.routes";

export const login: AppRouteHandler<LoginRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const { email, password } = await c.req.json();

	const foundUser = await db.query.users.findFirst({
		where(fields, operators) {
			return operators.eq(fields.email, email);
		},
	});

	if (!foundUser) {
		return c.json(
			{ message: HttpStatusPhrases.UNAUTHORIZED },
			HttpStatusCodes.UNAUTHORIZED,
		);
	}

	const validatePassword = await verifyPassword(password, foundUser.password);

	if (!validatePassword) {
		return c.json(
			{ message: HttpStatusPhrases.UNAUTHORIZED },
			HttpStatusCodes.UNAUTHORIZED,
		);
	}

	const payload = {
		id: foundUser?.id,
		email: foundUser?.email,
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10,
	};

	const token = await sign(payload, c.env.JWT_SECRET_KEY);
	setCookie(c, "token", token, {
		httpOnly: true,
		secure: c.env.NODE_ENV === "production",
		sameSite: c.env.NODE_ENV === "production" ? "None" : "Lax",
		maxAge: 60 * 60 * 10,
	});

	return c.json(
		{
			message: HttpStatusPhrases.OK,
			user: { id: foundUser?.id, email: foundUser?.email },
			token,
		},
		HttpStatusCodes.OK,
	);
};

export const logout: AppRouteHandler<LogoutRoute> = (c) => {
	setCookie(c, "token", "", {
		httpOnly: true,
		secure: c.env.NODE_ENV === "production",
		sameSite: c.env.NODE_ENV === "production" ? "None" : "Lax",
		maxAge: 0,
	});

	return c.json({ message: HttpStatusPhrases.OK }, HttpStatusCodes.OK);
};

export const getMe: AppRouteHandler<GetMeRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const jwtPayload = c.get("jwtPayload");

	if (!jwtPayload || !jwtPayload.id) {
		return c.json(
			{ message: HttpStatusPhrases.UNAUTHORIZED },
			HttpStatusCodes.UNAUTHORIZED,
		);
	}

	const result = await db
		.select({
			user: users,
			workspace: workspaces,
		})
		.from(users)
		.innerJoin(workspaces, eq(users.workspaceId, workspaces.id))
		.where(and(eq(users.id, jwtPayload.id), eq(users.isActive, true)))
		.limit(1);

	const { user, workspace } = result[0];

	const sanitizedUser = sanitizeUser(user);
	return c.json(
		{
			...sanitizedUser,
			workspace,
		},
		HttpStatusCodes.OK,
	);
};
