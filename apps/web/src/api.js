import axios from "axios";

// Single axios instance for every Gaia API call.
// Point the client at your API with VITE_API_URL in .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000"
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default api;
