import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  ip: { type: String },
  owner: { type: String },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

assetSchema.index({ name: "text", owner: "text" });

export default mongoose.model("Asset", assetSchema);
