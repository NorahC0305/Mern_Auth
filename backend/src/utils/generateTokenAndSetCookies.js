import jwt from "jsonwebtoken";

const generateTokenAndSetCookies = (userId, res) => {
	const access_token = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: process.env.JWT_ACCESS_LIFETIME /* in minutes */,
	});

	const refresh_token = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_LIFETIME /* in days */,
	});

	res.cookie("access_token", access_token, {
		httpOnly: true,
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge:
			parseInt(process.env.COOKIE_ACCESS_MAX_AGE) * 60 * 1000 /* in minutes */,
	});
	res.cookie("refresh_token", refresh_token, {
		httpOnly: true,
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge:
			parseInt(process.env.COOKIE_REFRESH_MAX_AGE) *
			24 *
			60 *
			60 *
			1000 /* in days */,
	});

	return { access_token, refresh_token };
};

export default generateTokenAndSetCookies;
