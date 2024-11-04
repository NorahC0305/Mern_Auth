import bcrypt from "bcryptjs";

export async function _verifyPassword(password, hashedPassword) {
	return await bcrypt.compare(password, hashedPassword);
}
