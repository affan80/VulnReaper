// Use ESM imports because package.json has "type": "module"
import { PORT } from "./config/env.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimiter from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import vulnerabilityRoutes from "./routes/vulnRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

// Jobs Queue initialization
// import "./jobs/queue.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Connect to MongoDB
connectDB();

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/vulnerabilities", vulnerabilityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/health", healthRoutes);

// Error Handler
app.use(errorHandler);
app.get("/home",(req,res)=>{
	res.send("Home Page")
})

// Start Server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
