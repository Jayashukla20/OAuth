import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  getMe: () => api.get("/api/auth/me"),

  logout: () => api.post("/api/auth/logout"),

  loginWithGoogle: () => {
    window.location.href = `${API_URL}/api/auth/google`;
  },
};

export const dashboardAPI = {
  getData: () => api.get("/api/dashboard"),
};

export default api;