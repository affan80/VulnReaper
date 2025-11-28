import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed, role });
    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user._id)
    });
  } catch (err) {
    return res.status(500).json({ message: err.toString() });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user._id)
    });
  } catch (err) {
    return res.status(500).json({ message: err.toString() });
  }
};

export const me = async (req, res) => {
  res.json(req.user);
};
