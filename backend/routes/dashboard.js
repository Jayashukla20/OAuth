import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/dashboard
 * Protected route
 */
router.get("/", isAuthenticated, async (req, res) => {
  try {

    const user = req.user;

    // Calculate days since user joined
    const memberDays = Math.floor(
      (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    );

    res.json({
      success: true,
      data: {
        user: user.toPublicProfile(),

        stats: {
          memberDays,
          lastLogin: user.lastLogin,
        },

        message: `Welcome back, ${user.displayName}!`,
      },
    });

  } catch (error) {

    console.error("Dashboard route error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });

  }
});

export default router;