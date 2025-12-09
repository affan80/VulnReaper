import express from "express";

const router = express.Router();

import dashboardController from "../controllers/dashboardController.js";

import { authenticate } from "../middleware/auth.js";

router.get("/", authenticate, dashboardController.getStats);

export default router;
