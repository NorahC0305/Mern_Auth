import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../axios/AxiosConfig";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await axiosInstance.patch("/users/updatePassword", {
				oldPassword,
				newPassword,
			});

			if (response.status === 200) {
				toast.success("Password updated successfully!");
				navigate("/profile", { replace: true });
			}
		} catch (error) {
			if (error.response && error.response.status === 400) {
				toast.error(error.response.data.message || "Invalid old password.");
			} else {
				toast.error("An error occurred while updating the password.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 bg-emerald-900 bg-opacity-50 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
			<h2 className="text-2xl text-white mb-6">Change Password</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="oldPassword" className="block text-white mb-2">
						Old Password
					</label>
					<input
						type="password"
						id="oldPassword"
						value={oldPassword}
						onChange={(e) => setOldPassword(e.target.value)}
						required
						className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
						placeholder="Enter your old password"
					/>
				</div>
				<div>
					<label htmlFor="newPassword" className="block text-white mb-2">
						New Password
					</label>
					<input
						type="password"
						id="newPassword"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
						className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
						placeholder="Enter your new password"
					/>
				</div>
				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-white mb-2 font-medium"
					>
						Confirm New Password
					</label>
					<input
						type="password"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-emerald-500"
						placeholder="Confirm your new password"
					/>
				</div>
				<button
					type="submit"
					className={`w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 ${
						loading ? "opacity-50 cursor-not-allowed" : ""
					}`}
					disabled={loading}
				>
					{loading ? "Updating..." : "Change Password"}
				</button>
			</form>
		</div>
	);
};

export default ChangePasswordPage;
