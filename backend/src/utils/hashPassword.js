import bcrypt from "bcryptjs";

export async function _hashPassword(password) {
	const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
	return await bcrypt.hash(password, saltRounds);
}
