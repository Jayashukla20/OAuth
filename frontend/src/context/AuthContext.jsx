import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

/**
 * AUTH CONTEXT
 * ============
 * Global authentication state management.
 *
 * Provides:
 *  - user: the authenticated user object (or null)
 *  - isAuthenticated: boolean
 *  - isLoading: true while checking auth on app load
 *  - logout: function to log the user out
 *  - refreshUser: re-fetch user from backend
 *
 * How it works:
 *  On app mount, we call /api/auth/me to check if a valid session exists.
 *  The backend returns the user if the session cookie is valid, otherwise 401.
 *  This is the ONLY source of truth for auth state — not localStorage, not
 *  JWT decoding on the frontend. The backend decides who is authenticated.
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // True until first auth check

  /**
   * checkAuth
   * ---------
   * Asks the backend "is there a valid session?"
   * Called once on app mount and after login.
   */
  const checkAuth = useCallback(async () => {
    try {
      const response = await authAPI.getMe();
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      // 401 means no valid session — this is normal for unauthenticated users
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        console.error('Auth check failed:', error.message);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check auth state on app mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * logout
   * ------
   * 1. Tells backend to destroy the session
   * 2. Clears frontend auth state
   * Frontend navigation is handled by the component that calls this.
   */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error.message);
    } finally {
      // Always clear local state, even if backend call fails
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    refreshUser: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth hook
 * Usage: const { user, isAuthenticated, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;