import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api"
});

api.interceptors.request.use(
  config => {
    const token =
      localStorage.getItem("token");
    let cartSessionId =
      localStorage.getItem("cartSessionId");

    if (!cartSessionId) {
      cartSessionId = crypto.randomUUID();
      localStorage.setItem("cartSessionId", cartSessionId);
    }

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }
    config.headers["x-cart-session-id"] = cartSessionId;

    return config;
  }
);

export default api;
