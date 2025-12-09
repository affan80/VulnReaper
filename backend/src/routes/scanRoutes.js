import express from "express";
import scanController from "../controllers/scanController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, scanController.scan);

export default router;
