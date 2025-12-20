import express from "express";
import { connect } from "mongoose";

const router = express.Router();

// Health check endpoint
router.get("/", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    service: "VulnReaper Backend API"
  });
});

export default router;