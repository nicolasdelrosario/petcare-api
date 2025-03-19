import { ROLE } from "./roles";

import type { SelectUserSchema } from "@/schemas/entities/user-schema";

export const canList = (user: SelectUserSchema) => {
	return (
		user.role === ROLE.ADMIN ||
		user.role === ROLE.OWNER ||
		user.role === ROLE.RECEPTIONIST ||
		user.role === ROLE.VET
	);
};

export const canGetOne = (user: SelectUserSchema, workspaceId: number) => {
	return user.role === ROLE.ADMIN || user.workspaceId === workspaceId;
};

export const canCreate = (user: SelectUserSchema) => {
	return user.role === ROLE.ADMIN;
};

export const canPatch = (user: SelectUserSchema, workspaceId: number) => {
	return (
		user.role === ROLE.ADMIN ||
		(user.role === ROLE.OWNER && user.workspaceId === workspaceId)
	);
};

export const canDelete = (user: SelectUserSchema) => {
	return user.role === ROLE.ADMIN;
};
