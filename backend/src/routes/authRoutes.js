import express from "express";
import authController from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.put("/profile", authenticate, authController.updateProfile);

export default router;
