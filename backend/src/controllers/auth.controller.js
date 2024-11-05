import AuthService from "../services/auth.service.js";
import generateTokenAndSetCookies from "../utils/generateTokenAndSetCookies.js";
import jwt from "jsonwebtoken";

class AuthController {
	signup = async (req, res) => {
		const { name, email, password } = req.body;
		try {
			const user = await AuthService.signup(name, email, password);

			res.status(201).json({
				status: "success",
				message: "Signup successful",
				data: {
					user: { ...user._doc, password: undefined },
				},
			});
		} catch (error) {
			res.status(400).json({
				status: "fail",
				message: error.message,
			});
		}
	};

	login = async (req, res) => {
		const { email, password } = req.body;
		try {
			const user = await AuthService.login(email, password);

			res.status(200).json({
				status: "success",
				message: "Login successful",
				data: {
					user: { ...user._doc, password: undefined },
				},
			});
		} catch (error) {
			res.status(400).json({
				status: "fail",
				message: error.message,
			});
		}
	};

	verifyOTP = async (req, res) => {
		const { OTPCode } = req.body;
		try {
			const user = await AuthService.verifyOTP(OTPCode);
			generateTokenAndSetCookies(user._id, res);

			res.status(200).json({
				status: "success",
				message: "Login verified successfully",
				user,
			});
		} catch (error) {
			res.status(400).json({
				status: "fail",
				message: error.message,
			});
		}
	};

	verifyEmail = async (req, res) => {
		const { userId, token: verifyEmailToken } = req.query;
		console.log(userId, verifyEmailToken);
		try {
			const user = await AuthService.verifyEmail(userId, verifyEmailToken);
			res.status(200).json({
				status: "success",
				message: "Email verified successfully",
				data: {
					user: { ...user._doc, password: undefined },
				},
			});
		} catch (error) {
			res.status(400).json({
				status: "fail",
				message: error.message,
			});
		}
	};

	refreshToken = async (req, res) => {
		const refresh_token = req.cookies.refresh_token;
		console.log(refresh_token);
		if (!refresh_token) {
			return res.status(401).json({ message: "Refresh token not found" });
		}

		try {
			const userData = jwt.verify(
				refresh_token,
				process.env.JWT_REFRESH_SECRET,
			);
			const userId = userData.userId;
			const { access_token, refresh_token: newRefreshToken } =
				generateTokenAndSetCookies(userId, res);

			res.status(200).json({
				status: "success",
				message: "Token refreshed successfully",
				tokens: {
					access_token,
					refresh_token: newRefreshToken,
				},
			});
		} catch (error) {
			res.status(403).json({
				status: "fail",
				message: error.message,
			});
		}
	};

	logout = async (req, res) => {
		res.clearCookie("access_token", {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});
		res.clearCookie("refresh_token", {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});
		res.status(200).json({
			status: "success",
			message: "Logout successful",
		});
	};

	forgotPassword = async (req, res) => {
		const { email } = req.body;
		try {
			await AuthService.forgotPassword(email);
			res.status(200).json({
				status: "success",
				message: "Password reset email sent",
			});
		} catch (error) {
			res.status(400).json({
				status: "fail",
				message: error.message,
			});
		}
	};

	resetPassword = async (req, res) => {
		const { token } = req.query;
		const { newPassword } = req.body;
		console.log(`token:`, token);
		console.log(`pass:`, newPassword);
		try {
			await AuthService.resetPassword(token, newPassword);
			res.status(200).json({
				status: "success",
				message: "Password reset successful",
			});
		} catch (error) {
			res.status(400).json({
				status: "fail",
				message: error.message,
			});
		}
	};
}

export default new AuthController();
