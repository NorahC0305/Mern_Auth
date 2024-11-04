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

	const routes = [
		{ path: "/", element: <HomePage /> },
		{ path: "/signup", element: <SignUpPage /> },
		{ path: "/login", element: <LoginPage /> },
		{ path: "/verify-email", element: <EmailVerifyPage /> },
		{ path: "/verify-otp", element: <OTPVerifyPage /> },
		{ path: "/change-password", element: <ChangePasswordPage /> },
		{ path: "/forgot-password", element: <ForgotPasswordPage /> },
		{ path: "/reset-password/", element: <ResetPasswordPage /> },
		{ path: "/profile", element: <Profile /> },
		{ path: "/about", element: <About /> },
		{ path: "*", element: <NotFoundPage /> },
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
			{/* Sticky Header */}
			<Header />

			<div className="flex-1 overflow-auto h-screen flex items-center justify-center">
				<Routes>
					{routes.map((route, index) => (
						<Route key={index} path={route.path} element={route.element} />
					))}
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
