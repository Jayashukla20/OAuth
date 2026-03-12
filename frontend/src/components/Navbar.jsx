import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">⬡</span>
          <span className="brand-text">Nexus</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${isActive("/") ? "active" : ""}`}
        >
          Home
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
            >
              Dashboard
            </Link>

            <div className="navbar-user">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.displayName || "User"}
                  className="user-avatar-sm"
                />
              )}

              <span className="user-name-sm">
                {user?.displayName?.split(" ")[0] || "User"}
              </span>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn-logout"
              >
                {loggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className={`nav-link nav-link-cta ${isActive("/login") ? "active" : ""}`}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;