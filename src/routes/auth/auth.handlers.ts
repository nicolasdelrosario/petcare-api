import * as HttpStatusCodes from "@/constants/http-status-codes";
import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import { createDB } from "@/db";
import { verifyPassword } from "@/helpers/auth-helper";
import type { AppRouteHandler } from "@/lib/types";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import type { LoginRoute } from "./auth.routes";

export const login: AppRouteHandler<LoginRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const { email, password } = await c.req.json();

	if (!email || !password) {
		return c.json(
			{ message: HttpStatusPhrases.BAD_REQUEST },
			HttpStatusCodes.BAD_REQUEST,
		);
	}

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
		sameSite: c.env.NODE_ENV === "production" ? "Strict" : "Lax",
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
