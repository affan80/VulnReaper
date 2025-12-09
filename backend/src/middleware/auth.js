// src/middleware/auth.js
/**
 * Auth middleware: verifies JWT, attaches user to req, and supports role checks.
 *
 * NOTE: This middleware assumes a User model exists at src/models/User.js.
 * If you don't want to fetch the user for every request you can skip the DB lookup
 * and instead embed minimal user info in the JWT payload.
 */

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/User.js"; // created in later phase

// Verify JWT and attach user object (if found)
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ success: false, error: "Missing auth token" });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    // attach basic payload
    req.user = payload;

    // optional: fetch fresh user from DB (useful if roles or status can change)
    try {
      const user = await User.findById(payload.id).select("-password"); // ensure password not returned
      if (user) req.user = user.toObject();
    } catch (err) {
      // ignore DB lookup error; we'll proceed with the token payload
      console.warn("auth middleware: failed to fetch user from DB", err.message);
    }

    return next();
  } catch (err) {
    return res.status(500).json({ success: false, error: "Authentication error" });
  }
}

/**
 * roleGuard(allowedRoles)
 *  - returns middleware that checks whether req.user has one of the allowed roles
 *  - expects req.user to be set by authenticate() first
 */
function roleGuard(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });

    // allowedRoles can be a single string or array
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // user roles might be string or array
    const userRoles = req.user.role ? (Array.isArray(req.user.role) ? req.user.role : [req.user.role]) : [];

    const has = roles.length === 0 || roles.some(r => userRoles.includes(r));
    if (!has) return res.status(403).json({ success: false, error: "Forbidden (insufficient role)" });

    return next();
  };
}

export { authenticate, roleGuard };
export const protect = authenticate;
export default authenticate;
