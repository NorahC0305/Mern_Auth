import User from "../models/user.model.js";
import { _hashPassword } from "../utils/hashPassword.js";
import { _verifyPassword } from "../utils/verifyPassword.js";

class UserService {
	getAllUser = async () => {
		try {
			return await User.find().select("-password");
		} catch (error) {
			throw new Error("Failed to fetch users: " + error.message);
		}
	};

	getUserById = async (id) => {
		try {
			const user = await User.findById(id);
			if (!user) {
				throw new Error("User not found.");
			}
			return user;
		} catch (error) {
			throw new Error("Error fetching user by ID: " + error.message);
		}
	};

	getUserByEmail = async (email) => {
		try {
			const user = await User.findOne({ email });
			if (!user) {
				throw new Error("User not found.");
			}
			return user;
		} catch (error) {
			throw new Error("Error fetching user by email: " + error.message);
		}
	};

	updateProfile = async (id, userData) => {
		try {
			const user = await User.findByIdAndUpdate(id, userData, { new: true });
			if (!user) {
				throw new Error("User not found.");
			}
			return user;
		} catch (error) {
			throw new Error("Error updating user: " + error.message);
		}
	};

	updatePassword = async (id, oldPassword, newPassword) => {
		try {
			const user = await User.findById(id);
			if (!user) {
				return null;
			}

			const isPasswordCorrect = await _verifyPassword(
				oldPassword,
				user.password,
			);
			if (!isPasswordCorrect) {
				const error = new Error("Incorrect old password.");
				error.statusCode = 400;
				throw error;
			}
			const checkSameOldPassword = await _verifyPassword(
				newPassword,
				user.password,
			);
			if (checkSameOldPassword) {
				const error = new Error(
					"New password cannot be the same as old password.",
				);
				error.statusCode = 400;
				throw error;
			}

			user.password = await _hashPassword(newPassword);
			await user.save();

			return user;
		} catch (error) {
			throw error;
		}
	};
}

export default new UserService();
