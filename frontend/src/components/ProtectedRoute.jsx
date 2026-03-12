import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PROTECTED ROUTE COMPONENT
 * ==========================
 * Wraps routes that require authentication.
 *
 * Behavior:
 *  - While auth is loading (app startup): shows a loading spinner
 *  - If authenticated: renders the child component
 *  - If NOT authenticated: redirects to /login
 *    (saves the attempted URL so we can redirect back after login)
 *
 * IMPORTANT: This is a UX convenience, not a security mechanism.
 * The backend middleware is the real security layer. This just
 * prevents unnecessary renders and improves user experience.
 *
 * Usage:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while we check session on app startup
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Verifying authentication...</p>
      </div>
    );
  }

  // Not authenticated — redirect to login, saving the attempted path
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: 'Please log in to access this page.' }}
        replace
      />
    );
  }

  // Authenticated — render the protected content
  return children;
};

export default ProtectedRoute;