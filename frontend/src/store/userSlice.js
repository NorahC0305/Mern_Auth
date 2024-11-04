import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const userCookie = Cookies.get("user");
// console.log(userCookie)
if (userCookie === "undefined") {
	Cookies.remove("user");
}

const initialState = {
	user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		login: (state, action) => {
			state.user = action.payload;
			Cookies.set("user", JSON.stringify(action.payload), { expires: 7 });
		},
		logout: (state) => {
			state.user = null;
			Cookies.remove("user");
		},
		updateUser: (state, action) => {
			state.user = { ...state.user, ...action.payload };
			Cookies.set("user", JSON.stringify(state.user), { expires: 7 });
		},
	},
});

export const { login, logout, updateUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export default userSlice.reducer;
