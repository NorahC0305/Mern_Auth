import crypto from "crypto";
export const generateOTPCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
export const generateEmailToken = () => {
	return crypto.randomBytes(32).toString("hex");
};

