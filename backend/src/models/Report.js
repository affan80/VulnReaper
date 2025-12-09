import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vulnerabilities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vulnerability" }],
    status: { type: String, enum: ["In Progress", "Completed"], default: "In Progress" },
  },
  { timestamps: true }
);

export default mongoose.model("Report", ReportSchema);
