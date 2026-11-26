import axios from "axios";

const apiBaseUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:2000/api"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: apiBaseUrl,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired/invalid JWTs globally on 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const isCredentialCheck =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/settings/change-password");

    if (status === 401 && !isCredentialCheck) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("features");

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
