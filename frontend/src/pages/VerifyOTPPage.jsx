import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import axiosInstance from "../axios/AxiosConfig";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
const VerifyOTPPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const codeLength = code.length;
	const isButtonDisabled = code.includes("") || isLoading;
	const dispatch = useDispatch();

	const handleChange = (index, value) => {
		const newCode = [...code];
		if (value.length > 1) {
			const pastedCode = value.slice(0, codeLength).split("");
			pastedCode.forEach((char, i) => {
				newCode[i] = char || "";
			});
			setCode(newCode);

			const focusIndex =
				pastedCode.length < codeLength ? pastedCode.length : codeLength - 1;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);
			if (value && index < codeLength - 1) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeydown = (index, event) => {
		if (event.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			setIsLoading(true);
			const OTPCode = code.join("");
			try {
				const response = await axiosInstance.post("/auth/verify-otp", {
					OTPCode,
				});
				console.log(response);
				if (response.status === 200) {
					const user = response.data.user;
					dispatch(login(user));
					toast.success("OTP verification successful. Login complete.");
					navigate("/", { replace: true });
				}
			} catch (error) {
				toast.error("OTP verification failed. Please try again.");
			} finally {
				setIsLoading(false);
			}
		},
		[code, navigate, dispatch],
	);

	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			const timer = setTimeout(() => handleSubmit(new Event("submit")));
			return () => clearTimeout(timer);
		}
	}, [handleSubmit, code]);

	return (
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className=" max-w-md w-full p-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'"
		>
			<h2 className="text-3xl font-bold text-green-400 mb-6 text-center bg-gradient-to-r from-green-400 to-green-500 text-transparent bg-clip-text">
				Verify your email
			</h2>
			<p className="text-center text-white mb-6 text-sm ">
				Enter the 6-digit code sent to your email
			</p>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className=" flex justify-center space-x-4">
					{code.map((_, index) => (
						<input
							key={index}
							type="text"
							// maxLength={6}
							className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
							ref={(el) => (inputRefs.current[index] = el)}
							value={code[index]}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeydown(index, e)}
						/>
					))}
				</div>
				<motion.button
					className={`mt-5 w-full py-3 px-4 font-bold rounded-lg shadow-lg transition duration-200 focus:outline-none focus:ring-2 ${
						isButtonDisabled
							? "bg-gray-500 text-gray-300 cursor-not-allowed"
							: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
					}`}
					whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
					whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
					type="submit"
					disabled={isButtonDisabled}
				>
					{isLoading ? (
						<Loader className="animate-spin mx-auto w-6 h-6" />
					) : (
						"Verify"
					)}
				</motion.button>
			</form>
		</motion.div>
	);
};

export default VerifyOTPPage;
