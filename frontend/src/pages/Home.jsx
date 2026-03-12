import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="page-home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            OAuth 2.0 Capstone Project
          </div>

          <h1 className="hero-title">
            Secure Auth,
            <br />
            <span className="hero-title-accent">Simplified.</span>
          </h1>

          <p className="hero-subtitle">
            A full-stack authentication application built with Google OAuth,
            Express sessions, and protected React routes. The reference
            implementation for modern web auth flows.
          </p>

          <div className="hero-cta">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard →
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Get Started →
              </Link>
            )}
            <a
              href="https://developers.google.com/identity/protocols/oauth2"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Learn OAuth 2.0
            </a>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Google OAuth 2.0</h3>
            <p>
              Industry-standard authentication. Users log in with their Google
              account — no passwords to manage or store.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Backend-First Security</h3>
            <p>
              Protected routes are guarded at the API level. Frontend checks
              are UX enhancements — the backend is the real gatekeeper.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Session Management</h3>
            <p>
              Encrypted server-side sessions stored in MongoDB. Cookies are
              httpOnly to prevent XSS attacks.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🗄️</div>
            <h3>MongoDB + Mongoose</h3>
            <p>
              User profiles are persisted with proper schemas, timestamps, and
              deduplication on repeat logins.
            </p>
          </div>
        </div>
      </section>

      {/* Auth Flow Diagram */}
      <section className="flow-section">
        <h2 className="section-title">The OAuth Flow</h2>
        <div className="flow-steps">
          {[
            { step: '01', label: 'User clicks "Sign in with Google"' },
            { step: '02', label: 'Backend redirects to Google OAuth' },
            { step: '03', label: 'User grants permission on Google' },
            { step: '04', label: 'Google redirects to callback URL' },
            { step: '05', label: 'Passport verifies & upserts user in DB' },
            { step: '06', label: 'Session created, user redirected to dashboard' },
          ].map(({ step, label }, i) => (
            <div key={step} className="flow-step">
              <div className="flow-step-number">{step}</div>
              <div className="flow-step-label">{label}</div>
              {i < 5 && <div className="flow-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;