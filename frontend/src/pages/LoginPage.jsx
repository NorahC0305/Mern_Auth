import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import { Lock, Mail, Loader, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../axios/AxiosConfig.js";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import googleSymbol from "../assets/icons8-google.svg";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	sendEmailVerification,
} from "firebase/auth";
import { app } from "../firebase/firebaseConfig.js";

const LoginPage = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	const firebaseAuth = getAuth(app);
	const provider = new GoogleAuthProvider();
	const dispatch = useDispatch();

	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setFormData((prevState) => ({ ...prevState, [id]: value }));
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage("");

		try {
			const { email, password } = formData;
			const response = await axiosInstance.post(
				"/auth/login",
				{ email, password },
				{ withCredentials: true },
			);

			toast.info("OTP sent to your email. Please enter the OTP to continue.");
			navigate("/verify-otp", { replace: true });
		} catch (error) {
			const { response } = error;
			setErrorMessage(
				response?.data?.message || "Network error: Please try again later.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const loginByGoogle = async () => {
		try {
			const result = await signInWithPopup(firebaseAuth, provider);
			const user = result.user;
			console.log(user);

			const formattedAvatar = user.photoURL
				? user.photoURL.replace("s96-c", "s1024-c")
				: "";

			const serializableUser = {
				_id: user.uid,
				email: user.email,
				name: user.displayName,
				avatar: formattedAvatar,
				isVerified: user.emailVerified,
				phone: user.phoneNumber,
				address: user.address,
				birthday: user.birthday,
				gender: user.gender,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				lastLogin: user.lastLogin,

				// Add other necessary fields
			};
			dispatch(login(serializableUser));
			toast.success("Login successful!");
			const token = await user.getIdToken();
			console.log(token);

			navigate("/", { replace: true });
		} catch (error) {
			console.error("Error during Google login:", error);
			toast.error("Error during Google login. Please try again later.");
		}
	};

	useEffect(() => {
		const storedUser = Cookies.get("user");
		if (storedUser) navigate("/", { replace: true });
	}, [navigate]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
		>
			<div className="p-8">
				<h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
					Welcome Back
				</h2>

				<form onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type="email"
						label="Email Address"
						placeholder="Enter your email address"
						id="email"
						value={formData.email}
						onChange={handleInputChange}
						required
					/>

					<div className="relative">
						<Input
							icon={Lock}
							type={showPassword ? "password" : "text"}
							label="Password"
							placeholder="Enter your password"
							id="password"
							value={formData.password}
							required
							onChange={handleInputChange}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
							onClick={() => setShowPassword((prev) => !prev)}
						>
							{showPassword ? <EyeOff /> : <Eye />}
						</button>
					</div>

					<div className="flex items-center mb-6">
						<Link
							to="/forgot-password"
							className="text-sm text-green-400 hover:underline"
						>
							Forgot password?
						</Link>
					</div>

					{errorMessage && (
						<p className="text-red-500 font-semibold mb-2">{errorMessage}</p>
					)}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader className="w-6 h-6 animate-spin mx-auto" />
						) : (
							"Login"
						)}
					</motion.button>
				</form>
				<p className="text-sm text-center text-white m-3">OR</p>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 flex justify-center gap-3"
					onClick={loginByGoogle}
					disabled={isLoading}
				>
					{isLoading ? (
						<Loader className="w-6 h-6 animate-spin mx-auto" />
					) : (
						<div className="flex items-center gap-2">
							Login with Google
							<img src={googleSymbol} alt="Google symbol" className="w-6 h-6" />
						</div>
					)}
				</motion.button>
			</div>
			<div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
				<p className="text-sm text-gray-400">
					Don't have an account?{" "}
					<Link to="/signup" className="text-green-400 hover:underline">
						Sign up
					</Link>
				</p>
			</div>
		</motion.div>
	);
};

export default LoginPage;
