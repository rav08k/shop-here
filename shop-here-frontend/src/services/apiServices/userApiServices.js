import { httpPost, httpGet, httpPut } from "./clientApiServices";
import {
	setDataToLocalStorage,
	getDataFromLocalStorage,
	removeDataFromLocalStorage,
} from "../localStorageServices";
import { useUserStore } from "../../stores/userStore";

const { setUser, resetUser } = useUserStore.getState();

const register = async (userData) => {
	try {
		const response = await httpPost("users/register", userData);
		if (response.ok) {
			console.log("registeration successful");
		}
		return response;
	} catch (error) {
		console.error("Registration failed:", error);
		throw error;
	}
};

const login = async (credentials) => {
	try {
		const res = await httpPost("auth/login", credentials);

		if (res.token) {
			console.log(res);
			let usrData = { user: res.user, token: res.token };
			setUser(usrData);
			setDataToLocalStorage("user", usrData);
		}
	} catch (error) {
		console.error("Login failed:", error);
		throw error;
	}
};

const logout = () => {
	removeDataFromLocalStorage("user")
	resetUser();
};

const getCurrentUser = () => {
	const userJson = getDataFromLocalStorage("user");
	return userJson ? JSON.parse(userJson) : null;
};

const isAuthenticated = () => {
	return useUserStore.getState().isAuthenticated;
};

const updateProfile = async (userData) => {
	try {
		const response = await httpPut("users/profile", userData);

		const currentUser = getCurrentUser();
		if (currentUser) {
			localStorage.setItem(
				"user",
				JSON.stringify({
					...currentUser,
					...response.user,
				})
			);
		}

		return response;
	} catch (error) {
		console.error("Profile update failed:", error);
		throw error;
	}
};

const getProfile = async () => {
	try {
		return await httpGet("users/profile");
	} catch (error) {
		console.error("Failed to fetch profile:", error);
		throw error;
	}
};

const requestPasswordReset = async (email) => {
	try {
		return await httpPost("auth/reset-password", { email });
	} catch (error) {
		console.error("Password reset request failed:", error);
		throw error;
	}
};

const setNewPassword = async (resetData) => {
	try {
		return await httpPost("auth/set-new-password", resetData);
	} catch (error) {
		console.error("Setting new password failed:", error);
		throw error;
	}
};

const initAuth = () => {
	const user = getCurrentUser();
	if (user?.token) {
		setUser(user)
	}
};

initAuth();

export {
	register,
	login,
	logout,
	getCurrentUser,
	isAuthenticated,
	updateProfile,
	getProfile,
	requestPasswordReset,
	setNewPassword,
};
