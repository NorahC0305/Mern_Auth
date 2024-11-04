import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default:
				"https://res.cloudinary.com/dchd2v10u/image/upload/v1697009700/avatar_q0210u.png",
		},
		phone: {
			type: Number,
		},
		address: {
			type: String,
		},
		gender: {
			type: String,
			enum: ["male", "female", "other"],
		},
		birthDate: {
			type: Date,
		},
		role: {
			type: String,
			enum: ["student", "admin", "teacher"],
			default: "student",
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},

		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verifyEmailToken: String,
		verifyEmailExpiresAt: Date,
		OTPCode: String,
		OTPExpiresAt: Date,
	},
	{ timestamps: true },
);

export default mongoose.model("User", userSchema);
