import mongoose from "mongoose";
import User from "./backend/src/models/User.js";
import { MONGO_URI } from "./backend/src/config/env.js";

async function checkUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    
    const users = await User.find({});
    console.log("Users in database:", users);
    
    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err.message);
  }
}

checkUsers();