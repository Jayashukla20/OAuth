import express from "express";

const router = express.Router();

router.get("/health", (req, res) => {

  res.json({
    success: true,
    status: "Server running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });

});

export default router;