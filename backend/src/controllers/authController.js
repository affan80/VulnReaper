// src/controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import bcrypt from "bcryptjs";


function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export default {
  // USER REGISTER (CREATE)
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const exists = await User.findOne({ email });
      if (exists)
        return res.status(400).json({ success: false, message: "Email already exists" });

      const user = await User.create({ name, email, password });
      const token = generateToken(user);
      
      const userResponse = user.toObject();
      delete userResponse.password;
      
      res.json({ success: true, token, user: userResponse });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // LOGIN
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ success: false, message: "User not found" });

      const match = await user.comparePassword(password);
      if (!match)
        return res.status(400).json({ success: false, message: "Invalid credentials" });

      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        success: true,
        token: generateToken(user),
        user: userResponse,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // READ USERS
  async getUsers(req, res) {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
  },

  // UPDATE USER
  async updateUser(req, res) {
    const { id } = req.params;
    const update = req.body;

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, data: user });
  },

  // DELETE USER
  async deleteUser(req, res) {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted" });
  },

  // UPDATE PROFILE
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, email, currentPassword, newPassword } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Update basic info
      if (name) user.name = name;
      if (email) {
        const emailExists = await User.findOne({ email, _id: { $ne: userId } });
        if (emailExists) {
          return res.status(400).json({ success: false, message: "Email already in use" });
        }
        user.email = email;
      }

      // Update password if provided
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ success: false, message: "Current password required" });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }
        user.password = newPassword;
      }

      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({ success: true, user: userResponse });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
