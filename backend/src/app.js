import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import vulnRoutes from "./routes/vulnRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/vulns", vulnRoutes);

app.get("/", (req, res) => res.json({ ok: true, msg: "VMS backend running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
