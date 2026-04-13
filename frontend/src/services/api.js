// API service layer — wired to Firebase Auth + Express backend
import axios from 'axios';
import { getAuthSync } from './firebase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor ────────────────────────────────────────────────────
// Get a fresh Firebase ID token on every request (auto-refreshes if expired)
api.interceptors.request.use(async (config) => {
  const firebaseAuth = getAuthSync();
  const user = firebaseAuth?.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken(/* forceRefresh */ false);
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.warn('Failed to get Firebase token:', err.message);
    }
  }
  return config;
});

// ─── Response interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // Try to force-refresh the token once before giving up
      const firebaseAuth = getAuthSync();
      const user = firebaseAuth?.currentUser;
      if (user && !err.config._retry) {
        err.config._retry = true;
        try {
          const freshToken = await user.getIdToken(true);
          err.config.headers.Authorization = `Bearer ${freshToken}`;
          return api(err.config);
        } catch {
          await firebaseAuth.signOut();
          if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
            window.location.href = '/login';
          }
        }
      } else {
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

// ─── Auth API ───────────────────────────────────────────────────────────────
export const authAPI = {
  // Called after Firebase signIn/createUser to sync profile with backend
  login:  (idToken) => api.post('/auth/login',  { idToken }),
  signup: (data)    => api.post('/auth/signup',  data),
  me:     ()        => api.get('/auth/me'),
  logout: ()        => api.post('/auth/logout'),
};

// ─── Chefs API ───────────────────────────────────────────────────────────────
export const chefsAPI = {
  getAll:     (params) => api.get('/chefs',             { params }),
  getById:    (id)     => api.get(`/chefs/${id}`),
  getMenu:    (id)     => api.get(`/chefs/${id}/menu`),
  getReviews: (id)     => api.get(`/chefs/${id}/reviews`),
};

// ─── Subscriptions API ───────────────────────────────────────────────────────
export const subscriptionsAPI = {
  create:              (data) => api.post('/subscriptions',          data),
  getMySubscriptions:  ()     => api.get('/subscriptions/my'),
  cancel:              (id)   => api.patch(`/subscriptions/${id}/cancel`),
  pause:               (id)   => api.patch(`/subscriptions/${id}/pause`),
};

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersAPI = {
  create:            (data)       => api.post('/orders',              data),
  getMyOrders:       ()           => api.get('/orders/my'),
  getById:           (id)         => api.get(`/orders/${id}`),
  updateStatus:      (id, status) => api.patch(`/orders/${id}/status`, { status }),
  getDeliveryOrders: ()           => api.get('/orders/delivery'),
};

// ─── Delivery Dashboard API ──────────────────────────────────────────────────
export const deliveryDashboardAPI = {
  getStats:    ()           => api.get('/delivery-dashboard/stats'),
  getEarnings: ()           => api.get('/delivery-dashboard/earnings'),
  updateStatus: (isOnline)  => api.put('/delivery-dashboard/status', { isOnline }),
};

// ─── Chef Dashboard API ───────────────────────────────────────────────────────
export const chefDashboardAPI = {
  getStats:      ()     => api.get('/chef-dashboard/stats'),
  getProfile:    ()     => api.get('/chef-dashboard/profile'),
  updateProfile: (data) => api.put('/chef-dashboard/profile', data),
  getSubscribers:()     => api.get('/chef-dashboard/subscribers'),
  getOrders:     ()     => api.get('/chef-dashboard/orders'),
  getMenu:       ()     => api.get('/chef-dashboard/menu'),
  updateMenu:    (data) => api.put('/chef-dashboard/menu', data),
  publishMenu:   ()     => api.post('/chef-dashboard/menu/publish'),
  getEarnings:   ()     => api.get('/chef-dashboard/earnings'),
  getSentiment:  ()     => api.get('/chef-dashboard/sentiment'),
  getIngredients:()     => api.get('/chef-dashboard/ingredients'),
};

// ─── Reviews API ─────────────────────────────────────────────────────────────
export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
};

// ─── Chef Join API ────────────────────────────────────────────────────────────
export const chefAPI = {
  join:           (inviteCode) => api.post('/chef/join', { inviteCode }),
  getSubscribers: ()           => api.get('/chef/subscribers'),
};

// ─── Delivery Orders API ──────────────────────────────────────────────────────
export const deliveryAPI = {
  getMyOrders:   ()                    => api.get('/deliveries/my'),
  updateStatus:  (orderId, status)     => api.patch(`/deliveries/${orderId}/status`, { status }),
};

export default api;
