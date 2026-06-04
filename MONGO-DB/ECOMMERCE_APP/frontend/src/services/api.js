import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)  => api.post("/auth/register", data),
  login:    (data)  => api.post("/auth/login",    data),
  getProfile:    () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:       (params) => api.get("/products", { params }),
  getFeatured:  ()       => api.get("/products/featured"),
  getById:      (id)     => api.get(`/products/${id}`),
  create:       (data)   => api.post("/products", data),
  update:       (id, data) => api.put(`/products/${id}`, data),
  delete:       (id)     => api.delete(`/products/${id}`),
  addReview:    (id, data) => api.post(`/products/${id}/reviews`, data),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  create:    (data) => api.post("/orders", data),
  getMyOrders: ()   => api.get("/orders/my"),
  getById:  (id)    => api.get(`/orders/${id}`),
  pay:       (id)   => api.put(`/orders/${id}/pay`),
  getAll:    ()     => api.get("/orders"),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const userAPI = {
  getAll:  ()          => api.get("/users"),
  update:  (id, data)  => api.put(`/users/${id}`, data),
  delete:  (id)        => api.delete(`/users/${id}`),
};

export default api;