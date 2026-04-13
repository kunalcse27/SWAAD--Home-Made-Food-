import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_DASHBOARDS = {
  chef: '/chef/dashboard',
  deliveryPartner: '/partner/dashboard',
  customer: '/customer/home',
};

/**
 * ProtectedRoute
 * - allowedRoles: string[] — if provided, only those roles can access the route
 * - If not authenticated → redirect to /login
 * - If wrong role → redirect to user's own dashboard
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#D98A52] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#8C867B] font-medium">Loading SWAAD...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const redirect = ROLE_DASHBOARDS[userRole] || '/';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
