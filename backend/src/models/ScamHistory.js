import mongoose from "mongoose";

const ScanHistorySchema = new mongoose.Schema(
  {
    target: { type: String, required: true },
    scanner: { type: [String], enum: ["nmap", "nikto", "masscan"], default: [] },
    results: { type: Array, default: [] },
    status: { type: String, enum: ["Running", "Completed", "Failed"], default: "Running" },
  },
  { timestamps: true }
);

export default mongoose.model("ScanHistory", ScanHistorySchema);
