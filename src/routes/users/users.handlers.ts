import * as HttpStatusCodes from "@/constants/http-status-codes";
import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import { createDB } from "@/db";
import { users } from "@/db/schemas/users";
import { hashPassword } from "@/helpers/auth-helper";
import type { AppRouteHandler } from "@/lib/types";
import type {
	CreateRoute,
	GetOneRoute,
	ListRoute,
	PatchRoute,
	RemoveRoute,
} from "@/routes/users/users.routes";
import { IdParamsSchema } from "@/schemas/id-params";
import { capitalizeWords } from "@/utils/capitalize";
import { sanitizeUser, sanitizeUsers } from "@/utils/user-sanitization";
import { and, eq } from "drizzle-orm";

export const list: AppRouteHandler<ListRoute> = async (c) => {
	const db = createDB(c.env.DB);

	const users = await db.query.users.findMany({
		where(fields, operators) {
			return operators.eq(fields.isActive, true);
		},
	});

	return c.json(sanitizeUsers(users));
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const user = await c.req.json();
	const { name, password, email } = user;

	if (await isEmailTaken(db, email)) {
		return c.json(
			{ message: HttpStatusPhrases.CONFLICT },
			HttpStatusCodes.CONFLICT,
		);
	}

	user.name = capitalizeWords(name);
	user.password = await hashPassword(password);

	const [inserted] = await db.insert(users).values(user).returning();

	return c.json(sanitizeUser(inserted), HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const { id } = IdParamsSchema.parse(c.req.param());

	const user = await db.query.users.findFirst({
		where(fields, operators) {
			return operators.and(
				operators.eq(fields.id, id),
				operators.eq(fields.isActive, true),
			);
		},
	});

	if (!user) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.json(sanitizeUser(user), HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const { id } = IdParamsSchema.parse(c.req.param());
	const updates = await c.req.json();
	const { email } = updates;

	if (email && (await isEmailTaken(db, email))) {
		return c.json(
			{ message: HttpStatusPhrases.CONFLICT },
			HttpStatusCodes.CONFLICT,
		);
	}

	const [user] = await db
		.update(users)
		.set(updates)
		.where(and(eq(users.id, id), eq(users.isActive, true)))
		.returning();

	if (!user) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.json(sanitizeUser(user), HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
	const db = createDB(c.env.DB);
	const { id } = IdParamsSchema.parse(c.req.param());
	const [deleted] = await db
		.delete(users)
		.where(and(eq(users.id, id), eq(users.isActive, true)))
		.returning();

	if (!deleted) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export async function isEmailTaken(
	db: ReturnType<typeof createDB>,
	email: string,
) {
	const user = await db.query.users.findFirst({
		where(fields, operators) {
			return operators.eq(fields.email, email);
		},
	});

	return Boolean(user);
}
