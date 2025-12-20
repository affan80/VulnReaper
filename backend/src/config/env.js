import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vms";
export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
