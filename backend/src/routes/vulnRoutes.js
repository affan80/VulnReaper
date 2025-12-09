// src/routes/vulnerabilityRoutes.js
import express from "express";
const router = express.Router();
import vulnController from "../controllers/vulnController.js";
import { authenticate } from "../middleware/auth.js";

// CRUD
router.post("/", authenticate, vulnController.create);
router.get("/", authenticate, vulnController.getAll);
router.get("/:id", authenticate, vulnController.getOne);
router.put("/:id", authenticate, vulnController.update);
router.delete("/:id", authenticate, vulnController.delete);

export default router;
