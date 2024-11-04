import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, selectUser } from "../store/userSlice";
import { toast } from "react-toastify";
import { storage } from "../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axiosInstance from "../axios/AxiosConfig";

const Profile = () => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const [isEdit, setIsEdit] = useState(false);
	const [avatar, setAvatar] = useState(user?.avatar || "");
	const [originalUserData, setOriginalUserData] = useState(null);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		dispatch(updateUser({ ...user, [name]: value }));
	};

	const toastId = React.useRef(null);

	// const handleAvatarChange = (event) => {
	// 	const selectedFile = event.target.files[0];
	// 	if (selectedFile) {
	// 		const fileRef = ref(storage, `avatars/${selectedFile.name}`);
	// 		const uploadTask = uploadBytesResumable(fileRef, selectedFile, {
	// 			contentType: selectedFile.type,
	// 		});

	// 		toast.promise(
	// 			new Promise((resolve, reject) => {
	// 				uploadTask.on(
	// 					"state_changed",
	// 					(snapshot) => {
	// 						const uploadPercentage =
	// 							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	// 						setProgress(uploadPercentage);
	// 					},
	// 					(error) => {
	// 						reject("Failed to upload avatar.");
	// 					},
	// 					() => {
	// 						getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
	// 							setAvatar(downloadUrl);
	// 							setProgress(0);
	// 							resolve("Avatar uploaded successfully!");
	// 						});
	// 					}
	// 				);
	// 			}),
	// 			{
	// 				pending: "Uploading avatar...",
	// 				success: {
	// 					render({ data }) {
	// 						return data;
	// 					},
	// 					autoClose: 2000,
	// 				},
	// 				error: {
	// 					render({ data }) {
	// 						return data;
	// 					},
	// 					autoClose: 2000,
	// 				},
	// 			}
	// 		);
	// 	}
	// };

	const handleAvatarChange = (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			const fileRef = ref(storage, `avatars/${selectedFile.name}`);
			const uploadTask = uploadBytesResumable(fileRef, selectedFile, {
				contentType: selectedFile.type,
			});

			if (toastId.current === null) {
				toastId.current = toast("Uploading avatar...", {
					progress: 0,
					autoClose: false,
				});
			}

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const uploadPercentage =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;

					// Update the initial toast with current progress
					if (toastId.current !== null) {
						toast.update(toastId.current, {
							progress: uploadPercentage / 100,
						});
					}
				},
				(error) => {
					toast.error("Failed to upload avatar.");
					toastId.current = null;
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
						setAvatar(downloadUrl);

						toast.dismiss(toastId.current);
						toastId.current = null;

						toast.success("Avatar uploaded successfully!", { autoClose: 3000 });
					});
				},
			);
		}
	};

	const handleSaveProfile = async () => {
		try {
			const newUser = {
				name: user.name,
				avatar,
				gender: user.gender,
				phone: user.phone,
				address: user.address,
				birthDate: user.birthDate,
			};

			const response = await axiosInstance.patch("/users/updateProfile", {
				userData: newUser,
			});

			console.log(response.data);
			dispatch(updateUser({ ...user, avatar }));
			toast.success("Profile updated successfully!");
			setIsEdit(false);
			setOriginalUserData(null);
		} catch (error) {
			console.log("Error details:", error.response?.data);
			toast.error("Failed to update profile.");
		}
	};

	const handleEditProfile = () => {
		setIsEdit(true);
		setOriginalUserData({ ...user, avatar });
	};

	const handleCancel = () => {
		dispatch(updateUser(originalUserData));
		setAvatar(originalUserData.avatar);
		setIsEdit(false);
		setOriginalUserData(null);
	};

	const convertDateFormat = (dateStr) => {
		const date = new Date(dateStr);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axiosInstance.get("/users/getMe");
				console.log(response.data);
				dispatch(updateUser(response.data));
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};
		fetchUserData();
	}, [dispatch]);

	return (
		<div className="p-6 bg-emerald-900 bg-opacity-50 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
			<h2 className="text-2xl text-white mb-6">User Profile</h2>
			<div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
				<div className="sm:col-span-4 flex flex-col items-center">
					<img
						src={avatar}
						alt="Avatar"
						className="rounded-full w-72 h-72 mb-4 object-cover"
					/>
					{isEdit && (
						<label className="mt-1 cursor-pointer">
							<input
								type="file"
								id="file-input"
								hidden
								onChange={handleAvatarChange}
								accept="image/*"
							/>
							<button
								className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black rounded-lg"
								onClick={() => document.getElementById("file-input").click()}
							>
								Change Avatar
							</button>
						</label>
					)}
				</div>
				<div className="sm:col-span-8 z-[999999999999]">
					<form className="space-y-4">
						<input
							type="text"
							name="name"
							value={user?.name || ""}
							onChange={handleInputChange}
							disabled={!isEdit}
							className={`w-full p-2 rounded border ${isEdit ? "border-gray-600" : "border-gray-300 bg-gray-100 text-gray-500"}`}
							placeholder="Name"
						/>
						<input
							type="text"
							name="email"
							value={user?.email || ""}
							disabled
							className="w-full p-2 rounded border border-gray-300 bg-gray-100 text-gray-500"
							placeholder="Email"
						/>
						<input
							type="text"
							name="phone"
							value={user?.phone || ""}
							onChange={handleInputChange}
							disabled={!isEdit}
							className={`w-full p-2 rounded border ${isEdit ? "border-gray-600" : "border-gray-300 bg-gray-100 text-gray-500"}`}
							placeholder="Phone"
						/>
						<input
							type="text"
							name="address"
							value={user?.address || ""}
							onChange={handleInputChange}
							disabled={!isEdit}
							className={`w-full p-2 rounded border ${isEdit ? "border-gray-600" : "border-gray-300 bg-gray-100 text-gray-500"}`}
							placeholder="Address"
						/>
						<select
							name="gender"
							value={user?.gender || ""}
							onChange={handleInputChange}
							disabled={!isEdit}
							className={`w-full p-2 rounded border ${isEdit ? "border-gray-600" : "border-gray-300 bg-gray-100 text-gray-500"}`}
						>
							<option value="" disabled>
								Select Gender
							</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="other">Other</option>
						</select>

						<input
							type="date"
							name="birthday"
							value={user?.birthday ? convertDateFormat(user?.birthday) : ""}
							onChange={handleInputChange}
							disabled={!isEdit}
							className={`w-full p-2 rounded border ${isEdit ? "border-gray-600" : "border-gray-300 bg-gray-100 text-gray-500"}`}
						/>
					</form>
					<div className="mt-6 flex justify-center space-x-4">
						{isEdit ? (
							<>
								<button
									className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
									onClick={handleSaveProfile}
								>
									Save
								</button>
								<button
									className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 w-full"
									onClick={handleCancel}
								>
									Cancel
								</button>
							</>
						) : (
							<button
								className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
								onClick={handleEditProfile}
							>
								Edit Profile
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
