import express from "express";
import reportController from "../controllers/reportController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, reportController.getAll);

router.post("/", authenticate, reportController.create);

router.get("/:id", authenticate, reportController.getOne);

router.put("/:id", authenticate, reportController.update);

router.delete("/:id", authenticate, reportController.delete);

export default router;
