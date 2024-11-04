import sendMail from "./nodemailer.config.js";
import {
	OTP_VERIFICATION_TEMPLATE,
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	WELCOME_EMAIL,
	EMAIL_VERiFICATION_TEMPLATE,
} from "./emailTemplates.js";

class SendEmail {
	sendOTPLogin = async (email, OTPCode, OTPExpiresAt) => {
		const subject = "OTP code for login";

		const expirationMinutes = Math.round((OTPExpiresAt - Date.now()) / 60000);

		const htmlContent = OTP_VERIFICATION_TEMPLATE.replace(
			"{OTPCode}",
			OTPCode,
		).replace("{OTPExpiresAt}", `${expirationMinutes} minutes`);

		await sendMail(email, subject, htmlContent);
	};

	sendVerificationEmail = async (
		userId,
		email,
		verifyEmailToken,
		verifyEmailExpiresAt,
	) => {
		const subject = "Verify your email address";

		const expirationMinutes = Math.round(
			(verifyEmailExpiresAt - Date.now()) / 60000,
		);
		const verificationLink = `${process.env.CLIENT_URL}/verify-email?userId=${userId}&token=${verifyEmailToken}`;
		const htmlContent = EMAIL_VERiFICATION_TEMPLATE.replace(
			"{verificationLink}",
			verificationLink,
		).replace("{verifyEmailExpiresAt}", `${expirationMinutes} minutes`);

		await sendMail(email, subject, htmlContent);
	};

	sendWelcomeEmail = async (email, name) => {
		const subject = "Welcome to our app";
		const htmlContent = WELCOME_EMAIL.replace("{name}", name);
		await sendMail(email, subject, htmlContent);
	};

	sendResetPasswordEmail = async (email, token, resetPasswordExpiresAt) => {
		const subject = "Reset your password";
		const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

		const expirationMinutes = Math.round(
			(resetPasswordExpiresAt - Date.now()) / 60000,
		);
		const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
			"{resetURL}",
			resetURL,
		).replace("{resetPasswordExpiresAt}", expirationMinutes + " minutes");
		await sendMail(email, subject, htmlContent);
	};

	sendPasswordResetSuccessEmail = async (email) => {
		const subject = "Password reset successful";
		const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;
		await sendMail(email, subject, htmlContent);
	};
}

export default new SendEmail();
