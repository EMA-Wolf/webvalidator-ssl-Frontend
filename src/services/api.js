import axios from "axios";
import { toast } from "react-toastify";
// Base URL for API requests
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3002/api";


// Create an Axios instance
const api = axios.create({
  baseURL,
});

// Add interceptors to handle authentication headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// // Login user and store token
// export const login = async (details) => {
//   try {
//     const response = await api.post("/api/auth/login", details);
//     const { token, userDetails } = response.data;
//     console.log("User", userDetails)
//     // console.log(userDetails)
//     localStorage.setItem("token", token); // Store token in localStorage
//     localStorage.setItem("User", JSON.stringify(userDetails)); // Return user data
//     if (userDetails.role === "admin") {
//       window.location.replace(`${window.location.origin}/admin`)
//     } else {
//       window.location.replace(`${window.location.origin}/home`)
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     toast.error(error.response?.data?.error || "Login failed.");
//     throw error;
//   }
// };

// // Register new user and log them in
// export const signup = async (details) => {
//   try {
//     await api.post("/api/auth/register", details);
//     return await login(details); // Automatically log in user
//   } catch (error) {
//     console.error("Signup error:", error);
//     toast.error(error.response?.data?.error || "Signup failed.");
//     throw error;
//   }
// };

// // Logout user
// export const logout = () => {
//   toast.success("User logged out successfully");
//   setTimeout(() => {
//     window.location.href = "/";  // Redirect to login page
//   }, 2000); // 2-second delay
// };

// Export the Axios instance for direct use if needed
export default api;