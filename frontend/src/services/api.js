// API service layer — ready for MERN backend integration

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('swaad_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('swaad_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login:  (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  sendOTP:(mobile) => api.post('/auth/send-otp', { mobile }),
  verifyOTP:(mobile, otp) => api.post('/auth/verify-otp', { mobile, otp }),
  me:     () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const chefsAPI = {
  getAll:    (params) => api.get('/chefs', { params }),
  getById:   (id) => api.get(`/chefs/${id}`),
  getMenu:   (id) => api.get(`/chefs/${id}/menu`),
  getReviews:(id) => api.get(`/chefs/${id}/reviews`),
  search:    (query) => api.get('/chefs/search', { params: { q: query } }),
};

export const chefDashboardAPI = {
  getStats:  () => api.get('/chef-dashboard/stats'),
  updateProfile: (data) => api.put('/chef-dashboard/profile', data),
  getOrders: () => api.get('/chef-dashboard/orders'),
  getMenu:   () => api.get('/chef-dashboard/menu'),
  updateMenu:(data) => api.put('/chef-dashboard/menu', data),
  publishMenu:() => api.post('/chef-dashboard/menu/publish')
};

export const subscriptionsAPI = {
  create: (data) => api.post('/subscriptions', data),
  getMySubscriptions: () => api.get('/subscriptions/my'),
  cancel: (id) => api.patch(`/subscriptions/${id}/cancel`),
  pause:  (id) => api.patch(`/subscriptions/${id}/pause`),
};

export const ordersAPI = {
  getMyOrders: () => api.get('/orders/my'),
  getById:     (id) => api.get(`/orders/${id}`),
  updateStatus:(id, status) => api.patch(`/orders/${id}/status`, { status })
};

export const reviewsAPI = {
  create: (data) => api.post('/reviews', data)
};

export default api;
