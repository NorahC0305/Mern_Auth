import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/AxiosConfig";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

const ResetPasswordPage = () => {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const queryParams = new URLSearchParams(location.search);
	const token = queryParams.get("token");

	const handleResetPassword = async (e) => {
		e.preventDefault();

		if (!token) {
			toast.error("No reset token provided.");
			return;
		}

		if (newPassword.length < 6) {
			toast.error("Password should be at least 6 characters long.");
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		try {
			setIsLoading(true);
			const response = await axiosInstance.post(
				`/auth/reset-password?token=${token}`,
				{
					newPassword,
				},
			);

			if (response.status === 200) {
				toast.success("Password updated successfully!");
				navigate("/login", { replace: true });
			}
		} catch (error) {
			toast.error("An error occurred while resetting the password.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-6 bg-emerald-900 bg-opacity-70 rounded-lg shadow-lg w-full max-w-md mx-auto">
			<h1 className="text-2xl text-white font-semibold mb-6">Reset Password</h1>

			<form onSubmit={handleResetPassword} className="space-y-4">
				<div>
					<label
						htmlFor="newPassword"
						className="block text-white font-medium mb-2"
					>
						New Password
					</label>
					<input
						type="password"
						id="newPassword"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-emerald-500"
						placeholder="Enter your new password"
						required
					/>
				</div>
				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-white font-medium mb-2"
					>
						Confirm Password
					</label>
					<input
						type="password"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-emerald-500"
						placeholder="Confirm your new password"
						required
					/>
				</div>
				<button
					type="submit"
					disabled={isLoading}
					className={`w-full py-2 px-4 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition duration-200 ${
						isLoading ? "opacity-50 cursor-not-allowed" : ""
					}`}
				>
					{isLoading ? (
						<Loader className="w-6 h-6 animate-spin mx-auto" />
					) : (
						"Change password"
					)}
				</button>
			</form>
		</div>
	);
};

export default ResetPasswordPage;
