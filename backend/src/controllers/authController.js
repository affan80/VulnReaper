// Import necessary libraries for password hashing, JWT tokens, and the User model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Function to create a JWT token for a user
const createToken = (userId) => {
  // Sign the token with the user's ID, using the secret from environment variables
  // Token expires in 7 days by default, or as set in environment
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

// Function to handle user registration (signup)
export const register = async (req, res) => {
  // Get the name, email, password, and role from the request body
  const { name, email, password, role } = req.body;

  try {
    // Check if all required fields are provided
    if (!name || !email || !password) {
      // If not, send a bad request error
      return res.status(400).json({ message: "Missing required fields: name, email, password" });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If yes, send a conflict error
      return res.status(409).json({ message: "This email is already registered" });
    }

    // Generate a salt for hashing the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user" // Default role is "user" if not provided
    });

    // Create a JWT token for the new user
    const token = createToken(newUser._id);

    // Send back the user details and token
    return res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: token
    });
  } catch (error) {
    // If something goes wrong, send a server error
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Function to handle user login
export const login = async (req, res) => {
  // Get the email and password from the request body
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      // If not, send a bad request error
      return res.status(400).json({ message: "Missing required fields: email, password" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // If user not found, send unauthorized error
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      // If passwords don't match, send unauthorized error
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT token for the user
    const token = createToken(user._id);

    // Send back the user details and token
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token
    });
  } catch (error) {
    // If something goes wrong, send a server error
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Function to get the current user's information (requires authentication)
export const me = async (req, res) => {
  // The user information is already attached to the request by the auth middleware
  // Send back the user details (without password)
  res.json(req.user);
};
