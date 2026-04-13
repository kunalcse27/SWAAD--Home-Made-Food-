import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import useStore from './hooks/useStore';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import CustomerHome from './pages/CustomerHome';
import TiffinDetail from './pages/TiffinDetail';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import ReviewsPage from './pages/ReviewsPage';
import CustomerDashboard from './pages/CustomerDashboard';
import HowItWorks from './pages/HowItWorks';
import ProtectedRoute from './components/ProtectedRoute';
import { useSocketEvents } from './hooks/useSocketEvents';

// Chef Imports
import ChefLayout from './layouts/ChefLayout';
import ChefDashboard from './pages/chef/ChefDashboard';
import ChefSubscribers from './pages/chef/ChefSubscribers';
import ChefEarnings from './pages/chef/ChefEarnings';
import ChefProfile from './pages/chef/ChefProfile';
import ChefPostMenu from './pages/chef/ChefPostMenu';

// Delivery / Partner Imports
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import PartnerJoin from './pages/partner/PartnerJoin';

// ─── Sync AuthContext state into Zustand store ───────────────────────────────
// This keeps legacy components that use useStore() working without changes.
function AuthSyncer() {
  const { currentUser, userRole, userProfile, isAuthenticated } = useAuth();
  const { setUser, logout } = useStore();

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      setUser(
        {
          _id: userProfile._id || userProfile.uid || currentUser?.uid,
          name: userProfile.name,
          email: userProfile.email,
          avatar: userProfile.avatar || 'https://i.pravatar.cc/150?img=35',
          inviteCode: userProfile.inviteCode,
        },
        userRole
      );
    } else if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, userProfile, userRole, currentUser, setUser, logout]);

  return null;
}

// ─── Role-based redirect for authenticated users landing on public pages ─────
function AuthRedirect() {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (userRole === 'chef') return <Navigate to="/chef/dashboard" replace />;
  if (userRole === 'deliveryPartner') return <Navigate to="/partner/dashboard" replace />;
  return <Navigate to="/customer/home" replace />;
}

// ─── App Shell ───────────────────────────────────────────────────────────────
function AppShell() {
  useSocketEvents();

  return (
    <>
      <AuthSyncer />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#302E2B',
            color: '#fff',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#D98A52', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* ── Public Routes ────────────────────────────────────────────── */}
        <Route path="/"              element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/login"         element={<AuthPage mode="login" />} />
        <Route path="/signup"        element={<AuthPage mode="signup" />} />
        <Route path="/chef-signup"   element={<AuthPage mode="signup" defaultRole="Home Chef" />} />
        <Route path="/delivery-signup" element={<AuthPage mode="signup" defaultRole="Partner" />} />
        <Route path="/how-it-works"  element={<HowItWorks />} />

        {/* ── Customer Routes ──────────────────────────────────────────── */}
        <Route path="/customer/home" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MainLayout><CustomerHome /></MainLayout>
          </ProtectedRoute>
        } />
        {/* Legacy /home redirect */}
        <Route path="/home" element={<Navigate to="/customer/home" replace />} />

        <Route path="/tiffin/:id" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MainLayout><TiffinDetail /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/tiffin/:id/reviews" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MainLayout><ReviewsPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MainLayout hideFooter><CheckoutPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/customer/dashboard" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MainLayout><CustomerDashboard /></MainLayout>
          </ProtectedRoute>
        } />

        {/* ── Chef Routes ───────────────────────────────────────────────── */}
        <Route
          path="/chef"
          element={
            <ProtectedRoute allowedRoles={['chef']}>
              <ChefLayout />
            </ProtectedRoute>
          }
        >
          <Route index              element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"   element={<ChefDashboard />} />
          <Route path="subscribers" element={<ChefSubscribers />} />
          <Route path="earnings"    element={<ChefEarnings />} />
          <Route path="profile"     element={<ChefProfile />} />
          <Route path="post-menu"   element={<ChefPostMenu />} />
          <Route path="settings"    element={<div className="p-8 text-ink">Settings (Coming Soon)</div>} />
        </Route>

        {/* ── Delivery / Partner Routes ─────────────────────────────────── */}
        <Route path="/partner/dashboard" element={
          <ProtectedRoute allowedRoles={['deliveryPartner']}>
            <DeliveryDashboard />
          </ProtectedRoute>
        } />
        <Route path="/partner/join" element={
          <ProtectedRoute allowedRoles={['deliveryPartner']}>
            <PartnerJoin />
          </ProtectedRoute>
        } />
        {/* Legacy /delivery/dashboard redirect */}
        <Route path="/delivery/dashboard" element={<Navigate to="/partner/dashboard" replace />} />

        {/* ── Catch-all → role-based redirect ──────────────────────────── */}
        <Route path="/dashboard" element={<AuthRedirect />} />

        {/* ── 404 ──────────────────────────────────────────────────────── */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F9F8F6]">
            <div className="text-8xl">🍽️</div>
            <h1 className="text-3xl font-bold text-[#302E2B]">Page not found</h1>
            <p className="text-[#8C867B]">The page you're looking for doesn't exist.</p>
            <a href="/" className="px-6 py-3 bg-[#D98A52] text-white rounded-full font-bold hover:bg-[#c27642] transition-colors">
              Go Home
            </a>
          </div>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
