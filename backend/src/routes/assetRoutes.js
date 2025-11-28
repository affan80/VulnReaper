import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createAsset,
  createAssetsBulk,
  getAssets,
  getAssetById,
  updateAsset,
  updateAssetTags,
  deleteAsset,
  deleteManyAssets
} from "../controllers/assetController.js";

const router = express.Router();

router.post("/", protect, createAsset);
router.post("/bulk", protect, createAssetsBulk);

router.get("/", protect, getAssets);
router.get("/:id", protect, getAssetById);

router.put("/:id", protect, updateAsset);
router.patch("/:id/tags", protect, updateAssetTags);

router.delete("/:id", protect, deleteAsset);
router.delete("/", protect, deleteManyAssets);

export default router;
