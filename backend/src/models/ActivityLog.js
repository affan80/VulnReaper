import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true }, // e.g., "Scan Started", "Created Report"
    details: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", ActivityLogSchema);
