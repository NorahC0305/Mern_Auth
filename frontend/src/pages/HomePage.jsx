import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/AxiosConfig";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const HomePage = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(() => {
		const storedUser = Cookies.get("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	// Handle logout
	const logout = async () => {
		try {
			await axiosInstance.post("/auth/logout");
			Cookies.remove("user");
			toast.success("Logout successful!");
			navigate("/login", { replace: true });
		} catch (error) {
			toast.error("Logout failed. Please try again.");
			console.error("Logout failed:", error);
		}
	};

	const getMe = async () => {
		try {
			const response = await axiosInstance.get("/users/getMe");
			const fetchedUser = response.data.data.user;
			setUser(fetchedUser);
			Cookies.set("user", JSON.stringify(fetchedUser), { expires: 7 });
			toast.success("User data updated successfully!");
		} catch (error) {
			console.error("Failed to fetch user data:", error);
			if (error.response && error.response.status === 401) {
				logout();
				toast.error("Session expired. Please log in again.");
			} else {
				toast.error("Failed to fetch user data.");
			}
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-5 bg-gray-800 bg-opacity-50 rounded-lg">
			<h1 className="text-2xl font-bold text-white">
				Welcome, {user?.name || "Guest"}!
			</h1>
			<p className="text-gray-300">Email: {user?.email || "Not Available"}</p>
			<div className="mt-5">
				<button
					className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-3 w-full"
					onClick={logout}
				>
					Logout
				</button>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
					onClick={getMe}
				>
					Refresh User Data
				</button>
			</div>
		</div>
	);
};

export default HomePage;
