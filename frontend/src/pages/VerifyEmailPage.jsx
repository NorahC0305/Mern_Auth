import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../axios/AxiosConfig";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

const VerifyEmailPage = () => {
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();
	const navigate = useNavigate();
	const hasVerified = useRef(false);

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const userId = queryParams.get("userId");
		const token = queryParams.get("token");

		if (!userId || !token) {
			setMessage("Invalid or missing verification parameters.");
			setIsLoading(false);
			return;
		}

		const verifyEmail = async () => {
			try {
				const response = await axiosInstance.get(
					`/auth/verify-email?userId=${userId}&token=${token}`,
				);
				setMessage(response.data.message);
				toast.success("Email verified successfully!");

				setTimeout(() => {
					navigate("/login", { replace: true });
				}, 1000);
			} catch (error) {
				setMessage(
					error.response?.data?.message ||
						"Verification failed. Please try again.",
				);
				toast.error("Verification failed.");
			} finally {
				setIsLoading(false);
			}
		};

		if (!hasVerified.current) {
			verifyEmail();
			hasVerified.current = true;
		}
	}, [location, navigate]);

	return (
		<div className="flex items-center justify-center bg-gray-100">
			<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
				<h1 className="text-2xl font-bold text-green-500 mb-4">
					Email Verification
				</h1>
				{isLoading ? (
					<Loader className="animate-spin w-8 h-8 text-green-500 mx-auto" />
				) : (
					<p className="text-gray-700">{message}</p>
				)}
			</div>
		</div>
	);
};

export default VerifyEmailPage;
