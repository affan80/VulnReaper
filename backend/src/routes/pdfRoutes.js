import express from "express";
import pdfController from "../controllers/pdfController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/generate/:id", authenticate, pdfController.generate);

router.get("/download/:id", authenticate, pdfController.download);

export default router;
