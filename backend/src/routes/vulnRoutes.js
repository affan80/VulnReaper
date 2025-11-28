import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createVuln,
  createVulnsBulk,
  getVulns,
  getVulnById,
  updateVuln,
  updateVulnStatus,
  deleteVuln,
  deleteManyVulns
} from "../controllers/vulnController.js";

const router = express.Router();

router.post("/", protect, createVuln);
router.post("/bulk", protect, createVulnsBulk);

router.get("/", protect, getVulns);
router.get("/:id", protect, getVulnById);

router.put("/:id", protect, updateVuln);
router.patch("/:id/status", protect, updateVulnStatus);

router.delete("/:id", protect, deleteVuln);
router.delete("/", protect, deleteManyVulns);

export default router;
