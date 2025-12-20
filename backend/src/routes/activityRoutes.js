// src/routes/activityRoutes.js
import express from "express";
import activityController from "../controllers/activityController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// READ activity logs
router.get("/", authenticate, activityController.getAll);

// CREATE activity
router.post("/", authenticate, activityController.create);

// DELETE activity
router.delete("/:id", authenticate, activityController.delete);

export default router;
