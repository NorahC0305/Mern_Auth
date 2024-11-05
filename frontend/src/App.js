import React from "react";
import { Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import OTPVerifyPage from "./pages/VerifyOTPPage";
import HomePage from "./pages/HomePage";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmailVerifyPage from "./pages/VerifyEmailPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/Header";
import Profile from "./components/Profile";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import About from "./components/About";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	const floatingShapes = [
		{
			color: "bg-green-500",
			size: "w-64 h-64",
			top: "-5%",
			left: "10%",
			delay: 0,
		},
		{
			color: "bg-emerald-500",
			size: "w-48 h-48",
			top: 70,
			left: "80%",
			delay: 5,
		},
		{
			color: "bg-lime-500",
			size: "w-32 h-32",
			top: "40%",
			left: "-10%",
			delay: 2,
		},
	];

	return (
		<div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
			{floatingShapes.map((shape, index) => (
				<FloatingShape
					key={index}
					color={shape.color}
					size={shape.size}
					top={shape.top}
					left={shape.left}
					delay={shape.delay}
				/>
			))}
			<Header />

			<div className="flex-1 overflow-auto h-screen flex items-center justify-center">
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<HomePage />} />
					<Route path="/about" element={<About />} />
					<Route path="/signup" element={<SignUpPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/verify-email" element={<EmailVerifyPage />} />
					<Route path="/verify-otp" element={<OTPVerifyPage />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />

					{/* Protected Routes */}
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/reset-password"
						element={
							<ProtectedRoute>
								<ResetPasswordPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/change-password"
						element={
							<ProtectedRoute>
								<ChangePasswordPage />
							</ProtectedRoute>
						}
					/>

					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</div>

			<Footer />

			<ToastContainer
				style={{ top: "100px" }}
				transition={Slide}
				autoClose={3000}
				newestOnTop
				pauseOnHover
				pauseOnFocusLoss={false}
				limit={5}
			/>
		</div>
	);
}

export default App;
