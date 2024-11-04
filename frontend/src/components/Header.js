import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../store/userSlice";
import axiosInstance from "../axios/AxiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase/firebaseConfig";

const Header = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const [showDropdown, setShowDropdown] = useState(false);
	const firebaseAuth = getAuth(app);
	const timeoutRef = useRef(null);

	const handleLogout = async () => {
		try {
			await axiosInstance.post("/auth/logout");
			await signOut(firebaseAuth);
			dispatch(logout());
			toast.success("Logout successful!");
			setShowDropdown(false);
			navigate("/login", { replace: true });
		} catch (error) {
			toast.error("Logout failed. Please try again.");
			console.error("Logout failed:", error);
		}
	};

	const handleMouseEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setShowDropdown(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setShowDropdown(false);
		}, 200);
	};
	// console.log(user?.avatar);
	return (
		<nav className="bg-white shadow-lg sticky top-0 z-50 px-6 py-2 ">
			<div className="container mx-auto p-4">
				<div className="flex justify-between">
					<div className="flex  items-center">
						<a href="/" className="text-lg font-bold text-gray-700">
							Home
						</a>
						<a href="/about" className="ml-4 text-lg font-bold text-gray-700">
							About
						</a>
						<a
							href="/products"
							className="ml-4 text-lg font-bold text-gray-700"
						>
							Product
						</a>
					</div>
					<div
						className="relative"
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						<img
							src={user?.avatar || "https://via.placeholder.com/150"}
							className="w-12 h-12 rounded-full cursor-pointer"
							alt="User Avatar"
						/>
						{showDropdown && (
							<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
								{user ? (
									<>
										<a
											href="/profile"
											className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
										>
											Profile
										</a>
										<a
											href="/change-password"
											className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
										>
											Change password
										</a>
										<button
											onClick={handleLogout}
											className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
										>
											Logout
										</button>
									</>
								) : (
									<button
										onClick={() => navigate("/login")}
										className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
									>
										Login
									</button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Header;
