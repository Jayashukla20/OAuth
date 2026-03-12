// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Core libraries
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";

// Internal modules
import connectDB from "./config/database.js";
const passport = (await import("./config/passport.js")).default;

// Routes
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import publicRoutes from "./routes/public.js";

// Connect to MongoDB
connectDB();

const app = express();


// ---------------- CORS ----------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);


// ---------------- BODY PARSING ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ---------------- SESSION ----------------
app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 7 * 24 * 60 * 60, // session expiry
    }),

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);


// ---------------- PASSPORT ----------------
app.use(passport.initialize());
app.use(passport.session());


// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/public", publicRoutes);


// Root route
app.get("/", (req, res) => {
  res.json({ message: "Auth API running 🚀" });
});


// ---------------- 404 ----------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});