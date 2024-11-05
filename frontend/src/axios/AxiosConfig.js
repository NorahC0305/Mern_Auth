import axios from "axios";
import { getAuth } from "firebase/auth";
export const BASE_URL = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	withCredentials: true,
});

axiosInstance.interceptors.request.use(
	async (config) => {
		const auth = getAuth();
		const currentUser = auth.currentUser;

		if (currentUser) {
			const token = await currentUser.getIdToken(true);
			console.log(token);
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Intercept responses
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (error.response && error.response.status === 401) {
			try {
				const response = await axios.post(
					`${BASE_URL}/auth/refresh-token`,
					{},
					{ withCredentials: true },
				);
				console.log(response);
				return axiosInstance(error.config);
			} catch (err) {
				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;
