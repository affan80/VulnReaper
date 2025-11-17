import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authmiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = "1h";
const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 6;

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateSignupInput = (name, email, password) => {
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return "All fields are required";
  }
  if (name.trim().length < MIN_NAME_LENGTH) {
    return `Name must be at least ${MIN_NAME_LENGTH} characters long`;
  }
  if (!validateEmail(email)) {
    return "Invalid email format";
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
  }
  return null;
};

const validateLoginInput = (email, password) => {
  if (!email?.trim() || !password?.trim()) {
    return "Email and password are required";
  }
  if (!validateEmail(email)) {
    return "Invalid email format";
  }
  return null;
};


const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const createUserResponse = (user, token) => ({
  message: "User registered successfully",
  token,
  user: { id: user.id, name: user.name, email: user.email },
});

const createLoginResponse = (user, token) => ({
  message: "Login successful",
  token,
  user: { id: user.id, name: user.name, email: user.email },
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validationError = validateSignupInput(name, email, password);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: { name: name.trim(), email: email.toLowerCase(), password: hashedPassword },
    });

    const token = generateToken(newUser.id);
    res.status(201).json(createUserResponse(newUser, token));

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationError = validateLoginInput(email, password);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);
    res.json(createLoginResponse(user, token));

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`User ${req.user.id} logged out at ${timestamp}`);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
