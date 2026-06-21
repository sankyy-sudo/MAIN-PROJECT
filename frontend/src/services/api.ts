import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api"
});

let csrfToken: string | null = null;

api.interceptors.request.use(
  async config => {
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
    const method = config.method?.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method || "")) {
      if (!csrfToken) {
        try {
          const response = await axios.get(
            `${api.defaults.baseURL}/security/csrf-token`,
            { withCredentials: true }
          );
          csrfToken = response.data.data.csrfToken;
        } catch {
          csrfToken = null;
        }
      }
      if (csrfToken) {
        config.headers["x-csrf-token"] = csrfToken;
      }
    }

    return config;
  }
);

export default api;
