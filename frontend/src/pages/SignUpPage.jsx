import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { UserIcon, Mail, Lock, Loader, Eye, EyeOff } from "lucide-react";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import axiosInstance from "../axios/AxiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPasswordStrength, setShowPasswordStrength] = useState(false);
	const navigate = useNavigate();
	const ref = useRef(null);

	const handleSignUp = async (e) => {
		e.preventDefault();
		if (isLoading) return; // Prevent multiple submissions
		setIsLoading(true);

		try {
			const response = await axiosInstance.post("/auth/signup", {
				name,
				email,
				password,
			});
			if (response.status === 201) {
				toast.success("Account created successfully!");
				navigate("/login", { replace: true });
			}
		} catch (error) {
			if (error.response && error.response.data) {
				toast.error(
					error.response.data.message || "Please fill all the fields.",
				);
			} else {
				toast.error("Something went wrong, please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleClickOutside = (event) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setShowPasswordStrength(false);
		}
	};

	// Close password strength meter when clicking outside
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
		>
			<div className="p-8">
				<h2 className="text-3xl font-bold text-green-400 mb-6 text-center bg-gradient-to-r from-green-400 to-green-500 text-transparent bg-clip-text">
					Create Account
				</h2>

				<form onSubmit={handleSignUp}>
					<Input
						icon={UserIcon}
						type="text"
						label="Username"
						placeholder="Enter your username"
						id="username"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<Input
						icon={Mail}
						type="email"
						label="Email Address"
						placeholder="Enter your email address"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<div className="relative">
						<Input
							icon={Lock}
							type={showPassword ? "password" : "text"}
							label="Password"
							placeholder="Enter your password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onFocus={() => setShowPasswordStrength(true)}
							required
						/>
						<button
							type="button"
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
							onClick={togglePasswordVisibility}
							aria-label="Toggle password visibility"
						>
							{showPassword ? <EyeOff /> : <Eye />}
						</button>
					</div>
					{showPasswordStrength && (
						<PasswordStrengthMeter password={password} />
					)}

					<motion.button
						className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="submit"
						disabled={isLoading}
						aria-busy={isLoading}
					>
						{isLoading ? (
							<Loader className="animate-spin mx-auto w-6 h-6" />
						) : (
							"Sign Up"
						)}
					</motion.button>
				</form>
			</div>

			<div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
				<p className="text-center text-gray-500">
					Already have an account?{" "}
					<a href="/login" className="text-green-500 hover:underline">
						Log in
					</a>
				</p>
			</div>
		</motion.div>
	);
};

export default SignUpPage;
