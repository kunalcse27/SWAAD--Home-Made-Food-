import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import CustomerHome from './pages/CustomerHome';
import TiffinDetail from './pages/TiffinDetail';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import ReviewsPage from './pages/ReviewsPage';
import useStore from './hooks/useStore';
import { authAPI } from './services/api';

// Chef Imports
import ChefLayout from './layouts/ChefLayout';
import ChefDashboard from './pages/chef/ChefDashboard';
import ChefSubscribers from './pages/chef/ChefSubscribers';
import ChefEarnings from './pages/chef/ChefEarnings';
import ChefProfile from './pages/chef/ChefProfile';
import ChefPostMenu from './pages/chef/ChefPostMenu';

// Delivery Imports
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, userRole } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/home" replace />;
  return children;
}

export default function App() {
  const { setUser, logout } = useStore();
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('swaad_token');
      if (token) {
        try {
          const res = await authAPI.me();
          const d = res.data;
          setUser({
            _id: d._id,
            name: d.name,
            email: d.email,
            avatar: d.avatar || 'https://i.pravatar.cc/150?img=35'
          }, d.role);
        } catch (error) {
          localStorage.removeItem('swaad_token');
          logout();
        }
      }
      setInitLoading(false);
    };
    initAuth();
  }, [setUser, logout]);

  if (initLoading) {
    return <div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', background: '#302E2B', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#FF6B2C', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/chef-signup" element={<AuthPage mode="signup" />} />
        <Route path="/delivery-signup" element={<AuthPage mode="signup" />} />

        {/* Protected */}
        <Route path="/home" element={
          <ProtectedRoute>
            <MainLayout><CustomerHome /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/tiffin/:id" element={
          <ProtectedRoute>
            <MainLayout><TiffinDetail /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/tiffin/:id/reviews" element={
          <ProtectedRoute>
            <MainLayout><ReviewsPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <MainLayout hideFooter><CheckoutPage /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Chef Protected Routes */}
        <Route path="/chef" element={<ProtectedRoute allowedRoles={['chef']}><ChefLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ChefDashboard />} />
          <Route path="subscribers" element={<ChefSubscribers />} />
          <Route path="earnings" element={<ChefEarnings />} />
          <Route path="profile" element={<ChefProfile />} />
          <Route path="post-menu" element={<ChefPostMenu />} />
          <Route path="settings" element={<div className="p-8 text-ink">Settings (Coming Soon)</div>} />
        </Route>

        {/* Delivery Partner Routes */}
        <Route path="/delivery/dashboard" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface">
            <div className="text-8xl">🍽️</div>
            <h1 className="text-3xl font-bold text-ink">Page not found</h1>
            <p className="text-ink-secondary">The page you're looking for doesn't exist.</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
