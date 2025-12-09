// src/middleware/validateTarget.js
/**
 * validateTarget middleware
 * - Ensures scan target is present and allowed by ALLOWED_TARGETS env var.
 * - ALLOWED_TARGETS is a comma-separated list of allowed hostnames/IP substrings or CIDRs.
 *
 * IMPORTANT:
 * This implementation uses a conservative substring/CIDR check helper.
 * For robust CIDR validation in production, replace with a library like `ip-range-check` or `ip-cidr`.
 */

const { ALLOWED_TARGETS } = require("../config/env");
const cidrCheck = require("ip-cidr-check") || null; // optional; fallback explained below

function normalizeList(listStr) {
  if (!listStr) return [];
  return listStr
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

const allowedList = normalizeList(ALLOWED_TARGETS);

/**
 * isAllowedTarget
 * - returns true if target matches any allowed entry (substring), or if an allowed entry looks like a CIDR and contains target
 * - target may be hostname, IP or CIDR
 */
function isAllowedTarget(target) {
  if (!allowedList.length) return false; // scanning disabled by default

  const t = target.toLowerCase();

  // direct substring match
  for (const a of allowedList) {
    const al = a.toLowerCase();
    if (al === t) return true; // exact match
    if (t.includes(al) || al.includes(t)) return true; // simple substring containment
    // attempt simple CIDR check if a looks like CIDR and ip-cidr library available
    if (al.includes("/") && cidrCheck) {
      try {
        if (cidrCheck.contains(al, t)) return true;
      } catch (err) {
        // ignore parse errors
      }
    }
  }

  return false;
}

export default function validateTarget(req, res, next) {
  try {
    const { target } = req.body || req.query || {};
    if (!target) return res.status(400).json({ success: false, error: "Missing target parameter" });

    if (!isAllowedTarget(target)) {
      return res.status(403).json({
        success: false,
        error:
          "Target not allowed. Configure ALLOWED_TARGETS in .env to enable scanning for permitted hosts/networks.",
      });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ success: false, error: "Target validation error" });
  }
};
