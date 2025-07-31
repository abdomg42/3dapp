import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";


const BaseUrl = "http://localhost:3000";


function isValidEmail(email) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		// Normalize email
		email = email.toLowerCase();

		// Validation
		if (!isValidEmail(email)) {
			set({ loading: false });
			toast.error("Please enter a valid email address");
			return { success: false };
		}
		if (password.length < 8) {
			set({ loading: false });
			toast.error("Password must be at least 8 characters");
			return { success: false };
		}
		if (password !== confirmPassword) {
			set({ loading: false });
			toast.error("Passwords do not match");
			return { success: false };
		}

		try {
			const res = await axios.post(`${BaseUrl}/user/createuser`, { name, email, password });
			set({ loading: false });
            toast.success("User added successfully" ,{
                duration: 4000,
                position: 'top-center'});
			return { success: true };
		} catch (error) {
			console.log(error);
			// Always ensure loading is set to false on error
			set({ loading: false });
			
			// Handle specific error cases
			if (error.response) {
				const status = error.response.status;
				const errorMessage = error.response.data?.error || 'Unknown error';
				
				switch (status) {
					case 409:
						toast.error("A user with this email already exists.");
						break;
					case 400:
						toast.error("Please fill in all required fields.");
						break;
					case 500:
						toast.error("Server error. Please try again later.");
						break;
					default:
						toast.error(errorMessage);
				}
			} else {
				toast.error("Network error. Please check your connection.");
			}
			
			return { success: false };
		}
	},
	login: async (email, password) => {
		set({ loading: true });

		// Normalize email
		email = email.toLowerCase();

		// Validation
		if (!isValidEmail(email)) {
			set({ loading: false });
			toast.error("Please enter a valid email address");
			throw new Error("Invalid email");
		}
		if (password.length < 8) {
			set({ loading: false });
			toast.error("Password must be at least 8 characters");
			throw new Error("Password too short");
		}

		try {
			const res = await axios.post(`${BaseUrl}/user/login`, { email, password });
			console.log(res);
			set({ user: res.data, loading: false });
            toast.success("Login successfully");
			return { success: true, user: res.data };
		} catch (error) {
			console.log(error);
			// Always ensure loading is set to false on error
			set({ loading: false });
			
			// Handle specific error cases
			if (error.response) {
				const status = error.response.status;
				const errorMessage = error.response.data?.error || 'Unknown error';
				
				switch (status) {
					case 401:
						toast.error("Invalid email or password. Please check your credentials.");
						break;
					case 400:
						toast.error("Please fill in all required fields.");
						break;
					case 500:
						toast.error("Server error. Please try again later.");
						break;
					default:
						toast.error(errorMessage);
				}
			} else {
				toast.error("Network error. Please check your connection.");
			}
			
			throw error;
		}
	},

	logout: async () => {
		try {
			await axios.post(`${BaseUrl}/user/logout`);
			set({ user: null, checkingAuth: false });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get(`${BaseUrl}/user/profile`);
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post(`${BaseUrl}/user/RefreshToken`);
			if (response.data.user) {
				set({ user: response.data.user, checkingAuth: false });
			}
		} catch (error) {
			console.log("Token refresh failed:", error);
			set({ user: null, checkingAuth: false });
			
			// Show toast for refresh token failure
			if (error.response?.status === 401) {
				toast.error("Session expired. Please login again.");
			} else {
				toast.error("Authentication error. Please login again.");
			}
			
			throw error;
		}
	},
}));


// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				refreshPromise = null;
                console.log("Refresh failed, logging out:", refreshError);
				
				// Clear user state and show appropriate message
				useUserStore.getState().logout();
				
				// Don't show toast here as it's already handled in refreshToken
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);