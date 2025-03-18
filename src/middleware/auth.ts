import * as HttpStatusCodes from "@/constants/http-status-codes";
import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import type { Env } from "@/lib/types";
import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export const authMiddleware = async (c: Context<Env>, next: Next) => {
	const publicPaths = ["/", "/login", "/doc", "/reference"];

	if (publicPaths.includes(c.req.path)) {
		return next();
	}

	const authHeader = c.req.header("Authorization");
	const cookieToken = getCookie(c, "token");
	const token = authHeader?.startsWith("Bearer ")
		? authHeader.substring(7)
		: cookieToken;

	if (!token) {
		return c.json(
			{ message: HttpStatusPhrases.UNAUTHORIZED },
			HttpStatusCodes.UNAUTHORIZED,
		);
	}

	try {
		const payload = await verify(token, c.env.JWT_SECRET_KEY);
		if (!payload) throw new Error("Invalid token");

		c.set("jwtPayload", payload);
		return next();
	} catch {
		return c.json(
			{ message: HttpStatusPhrases.UNAUTHORIZED },
			HttpStatusCodes.UNAUTHORIZED,
		);
	}
};
