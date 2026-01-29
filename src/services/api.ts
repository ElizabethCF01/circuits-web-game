import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "auth_token";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href =
        import.meta.env.BASE_URL?.replace(/\/$/, "") + "/login";
    }
    return Promise.reject(error);
  },
);

export { TOKEN_KEY };
export default api;
