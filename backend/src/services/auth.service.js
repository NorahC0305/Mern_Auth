import User from "../models/user.model.js";
import crypto from "crypto";
import {
	generateOTPCode,
	generateEmailToken,
} from "../utils/generateVerificationCode.js";
import SendEmail from "../nodemailer/sendEmail.js";
import { _verifyPassword } from "../utils/verifyPassword.js";
import { _hashPassword } from "../utils/hashPassword.js";

class AuthService {
	// OTP verification
	async verifyOTP(OTPCode) {
		const user = await User.findOne({
			OTPCode: OTPCode,
			OTPExpiresAt: { $gte: Date.now() },
		});
		if (!user) {
			throw new Error("Invalid or expired OTP code");
		}
		user.lastLogin = Date.now();
		user.OTPCode = undefined;
		user.OTPExpiresAt = undefined;
		await user.save();

		return user;
	}

	// Email verification
	async verifyEmail(userId, verifyEmailToken) {
		const user = await User.findOne({
			_id: userId,
			verifyEmailToken,
			verifyEmailExpiresAt: { $gte: Date.now() },
		});
		if (!user) {
			throw new Error("Invalid or expired email verification token");
		}

		user.isVerified = true;
		user.verifyEmailToken = undefined;
		user.verifyEmailExpiresAt = undefined;
		await user.save();
		await SendEmail.sendWelcomeEmail(user.email, user.name);
		return user;
	}

	// Login with OTP step
	async login(email, password) {
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			throw new Error("User not found");
		}

		const isPasswordCorrect = await _verifyPassword(password, user.password);
		if (!isPasswordCorrect) {
			throw new Error("Incorrect password");
		}

		if (!user.isVerified) {
			const newEmailToken = generateEmailToken();
			user.verifyEmailToken = newEmailToken;
			user.verifyEmailExpiresAt = Date.now() + 5 * 60 * 1000;
			await user.save();

			await SendEmail.sendVerificationEmail(
				user._id,
				user.email,
				newEmailToken,
				user.verifyEmailExpiresAt,
			);

			throw new Error("Email not verified. Please check your inbox.");
		}

		const otp = generateOTPCode();
		user.OTPCode = otp;
		user.OTPExpiresAt = Date.now() + 5 * 60 * 1000;
		await user.save();

		await SendEmail.sendOTPLogin(user.email, user.OTPCode, user.OTPExpiresAt);

		return {
			message: "OTP sent to your email. Please verify to complete login.",
			...user,
		};
	}

	// Forgot password
	async forgotPassword(email) {
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error("User not found");
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetPasswordExpiresAt = Date.now() + 10 * 60 * 1000;

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetPasswordExpiresAt;
		await user.save();

		await SendEmail.sendResetPasswordEmail(
			user.email,
			resetToken,
			resetPasswordExpiresAt,
		);
	}

	// Signup with email verification
	async signup(name, email, password) {
		const session = await User.startSession();
		session.startTransaction();
		try {
			const isExistedUser = await User.findOne({ email });
			if (isExistedUser) {
				throw new Error("User already exists");
			}

			const hashedPassword = await _hashPassword(password);
			const verifyEmailToken = generateEmailToken();
			const verifyEmailExpiresAt = Date.now() + 5 * 60 * 1000;

			const user = await User.create(
				[
					{
						name,
						email,
						password: hashedPassword,
						verifyEmailToken,
						verifyEmailExpiresAt,
					},
				],
				{ session },
			);

			await SendEmail.sendVerificationEmail(
				user[0]._id,
				user[0].email,
				verifyEmailToken,
				verifyEmailExpiresAt,
			);

			await session.commitTransaction();
			session.endSession();

			return user[0];
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		}
	}

	// Reset password
	async resetPassword(token, newPassword) {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gte: Date.now() },
		});
		if (!user) {
			throw new Error("Invalid or expired reset token");
		}

		user.password = await _hashPassword(newPassword);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await SendEmail.sendPasswordResetSuccessEmail(user.email);
	}
}

export default new AuthService();
