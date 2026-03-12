# Nexus — OAuth Full Stack Capstone

A complete authentication application built with **Google OAuth 2.0**, **Express sessions**, **MongoDB**, and **React**. This is the reference implementation for the Full Stack Capstone on OAuth & Protected Routes.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | Passport.js + Google OAuth 2.0 |
| Sessions | express-session + connect-mongo |

---

## Project Structure

```
capstone/
├── backend/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── passport.js       # Google OAuth strategy + serialize/deserialize
│   ├── middleware/
│   │   └── auth.js           # isAuthenticated, isNotAuthenticated
│   ├── models/
│   │   └── User.js           # Mongoose User schema
│   ├── routes/
│   │   ├── auth.js           # /api/auth/* — OAuth flow + logout
│   │   ├── dashboard.js      # /api/dashboard/* — PROTECTED routes
│   │   └── public.js         # /api/public/* — Public routes
│   ├── .env.example          # Environment variable template
│   ├── package.json
│   └── server.js             # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.jsx        # Navigation with auth-aware rendering
        │   └── ProtectedRoute.jsx # Client-side route guard
        ├── context/
        │   └── AuthContext.jsx   # Global auth state (useAuth hook)
        ├── pages/
        │   ├── Home.jsx          # Public landing page
        │   ├── Login.jsx         # Google OAuth entry point
        │   ├── Dashboard.jsx     # PROTECTED — requires auth
        │   └── NotFound.jsx      # 404 page
        ├── utils/
        │   └── api.js            # Axios instance + API methods
        ├── App.jsx               # Router + route definitions
        ├── index.js              # React entry point
        └── styles.css            # All styles
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)
- Google Cloud Console project with OAuth 2.0 credentials

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/capstone_auth
SESSION_SECRET=change_this_to_a_long_random_string
GOOGLE_CLIENT_ID=your_client_id_from_google_console
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_console
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URI:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
7. Copy **Client ID** and **Client Secret** into your `backend/.env`

### 4. Run the Application

```bash
# Terminal 1 — Start backend
cd backend
npm run dev     # uses nodemon for hot reload
# or: npm start

# Terminal 2 — Start frontend
cd frontend
npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## The OAuth Flow — Step by Step

```
User clicks "Sign in with Google"
        │
        ▼
GET /api/auth/google
(Backend redirects to Google's auth server)
        │
        ▼
User consents on Google's page
        │
        ▼
GET /api/auth/google/callback?code=...
(Google redirects back with authorization code)
        │
        ▼
Passport exchanges code for user profile
        │
        ▼
User upserted in MongoDB (created or updated)
        │
        ▼
Session created → session ID stored in httpOnly cookie
        │
        ▼
Backend redirects to: http://localhost:3000/dashboard
        │
        ▼
React calls GET /api/auth/me with cookie
Backend returns user profile
AuthContext updates → Dashboard renders
```

---

## Authentication Architecture

### Why Backend Protection Matters

```
❌ Frontend-only protection (INSECURE):
   User → Bypass React Router → curl /api/dashboard → Gets data!

✅ Backend middleware protection (SECURE):
   User → Any path → Hits isAuthenticated middleware → 401 if no session
```

Frontend route guards (`<ProtectedRoute>`) are **UX improvements only**.  
The `isAuthenticated` middleware on Express routes is the **actual security**.

### Session Flow

```
Login  → Session created in MongoDB
         Session ID → httpOnly cookie (JS can't access it)

Request → Cookie sent automatically by browser
          express-session reads session ID
          Loads session from MongoDB
          passport.deserializeUser fetches User by _id
          req.user is populated

Logout → Session destroyed in MongoDB
         Cookie cleared
         Frontend auth state cleared
```

---

## API Reference

### Public Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/public/health` | Server health check |
| GET | `/api/public/info` | App info |

### Auth Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | OAuth callback (handled by Passport) |
| GET | `/api/auth/me` | Get current user *(requires auth)* |
| POST | `/api/auth/logout` | Destroy session *(requires auth)* |

### Protected Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Dashboard data *(requires auth)* |
| GET | `/api/dashboard/profile` | User profile *(requires auth)* |

---

## Key Concepts Demonstrated

### 1. OAuth vs. Password Auth
Google OAuth means we never see or store user passwords. Google authenticates the user and gives us a verified identity token.

### 2. Passport.js Strategies
`passport-google-oauth20` handles the OAuth handshake. We configure it once in `config/passport.js` and use `passport.authenticate('google')` in routes.

### 3. Session Persistence
Sessions are stored in MongoDB via `connect-mongo`, not in server memory. This means sessions survive server restarts.

### 4. serializeUser / deserializeUser
- `serializeUser`: called after login — stores only `user._id` in session
- `deserializeUser`: called on every request — fetches full user from DB using stored `_id`

### 5. CORS + Credentials
Frontend and backend run on different ports (3000 vs 5000). For cookies to work cross-origin:
- Backend: `cors({ credentials: true, origin: 'http://localhost:3000' })`
- Frontend: Axios `withCredentials: true`

### 6. httpOnly Cookies
Session cookies have `httpOnly: true`. This means JavaScript in the browser cannot access them, protecting against XSS attacks.

---

## Security Checklist

- [x] No secrets in frontend code
- [x] Environment variables for all credentials
- [x] Backend middleware protects all private routes
- [x] httpOnly cookies prevent JS access
- [x] CORS configured to only allow known origins
- [x] Passwords are never stored (OAuth handles auth)
- [x] Session IDs are server-generated and stored in DB
- [x] Logout destroys session on backend AND clears cookie

---

## Common Issues

**"Cannot GET /api/auth/google"**  
→ Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`

**Redirect loops after login**  
→ Ensure `CLIENT_URL` in backend `.env` matches your frontend URL exactly

**401 on all requests**  
→ Check Axios has `withCredentials: true` and backend CORS has `credentials: true`

**Session not persisting**  
→ Confirm `MONGO_URI` is correct and MongoDB is running
# OAuth
