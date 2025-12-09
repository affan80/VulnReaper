// src/utils/validateTargetUtils.js

// Simple IP matcher
function isIp(value) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(value);
}

// Simple host matcher
function isHostname(value) {
  return /^[a-zA-Z0-9.-]+$/.test(value);
}

module.exports = {
  isIp,
  isHostname,
};
