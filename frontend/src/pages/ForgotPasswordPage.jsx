import React, { useState } from "react";
import axiosInstance from "../axios/AxiosConfig";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await axiosInstance.post("/auth/forgot-password", { email });
			toast.success("Password reset link sent to your email.");
			setEmail("");
			navigate("/login");
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Error sending reset link.";
			toast.error(errorMessage);
			console.error("Error details:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-6 bg-emerald-900 bg-opacity-70 rounded-lg shadow-lg w-full max-w-md mx-auto mt-10">
			<h1 className="text-2xl font-semibold text-white mb-4 text-center">
				Forgot Password
			</h1>
			<p className="text-gray-300 mb-6 text-center">
				Enter your email address to receive a password reset link.
			</p>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="email" className="block text-white font-medium mb-2">
						Email Address
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-emerald-500 text-gray-900"
						placeholder="Enter your email"
					/>
				</div>
				<div className="flex justify-center">
					<button
						type="submit"
						disabled={isLoading}
						className={`w-full py-2 px-4 font-semibold rounded-md transition duration-200 ${
							isLoading
								? "bg-gray-400 cursor-not-allowed text-gray-100"
								: "bg-emerald-600 text-white hover:bg-emerald-700"
						}`}
					>
						{isLoading ? (
							<Loader className="w-6 h-6 animate-spin mx-auto" />
						) : (
							"Reset Password"
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ForgotPasswordPage;
