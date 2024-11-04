import User from "../models/user.model.js";
import UserService from "../services/user.service.js";
import catchAsync from "../utils/catchAsync.js";

class UserController {
	getAllUser = catchAsync(async (req, res) => {
		const users = await UserService.getAllUser();
		res.status(200).json({
			status: "success",
			data: { users },
		});
	});

	getMe = catchAsync(async (req, res) => {
		const userId = req.user._id;
		const user = await UserService.getUserById(userId);
		res.status(200).json({
			status: "success",
			data: { user },
		});
	});

	getUserById = catchAsync(async (req, res) => {
		const { userId } = req.params;
		const user = await UserService.getUserById(userId);
		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User not found.",
			});
		}
		res.status(200).json({
			status: "success",
			data: { user },
		});
	});

	getUserByEmail = catchAsync(async (req, res) => {
		const { email } = req.body;
		const user = await UserService.getUserByEmail(email);
		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User not found.",
			});
		}
		res.status(200).json({
			status: "success",
			data: { user },
		});
	});

	updateProfile = catchAsync(async (req, res) => {
		const userId = req.user._id;
		const { userData } = req.body;
		const user = await UserService.updateProfile(userId, userData);
		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User not found.",
			});
		}
		res.status(200).json({
			status: "success",
			data: { user },
		});
	});

	updatePassword = catchAsync(async (req, res) => {
		const userId = req.user._id;
		const { oldPassword, newPassword } = req.body;

		try {
			const user = await UserService.updatePassword(
				userId,
				oldPassword,
				newPassword,
			);

			if (!user) {
				return res.status(404).json({
					status: "fail",
					message: "User not found.",
				});
			}

			res.status(200).json({
				status: "success",
				data: { user },
			});
		} catch (error) {
			if (error.statusCode === 400) {
				return res.status(400).json({
					status: "fail",
					statusCode: 400,
					message: error.message,
				});
			}
			res.status(500).json({
				status: "error",
				message: "An error occurred while updating the password.",
			});
		}
	});
}

export default new UserController();
