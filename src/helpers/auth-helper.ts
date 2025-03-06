import bcrypt from "bcryptjs";

export type VerifyPasswordParams = {
	password: string;
	hashedPassword: string;
};

export const hashPassword = async (password: string) => {
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	return hashedPassword;
};

export const verifyPassword = async (
	password: string,
	hashedPassword: string,
) => {
	const isMatch = await bcrypt.compare(password, hashedPassword);
	return isMatch;
};
