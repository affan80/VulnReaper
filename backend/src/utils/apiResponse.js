// src/utils/apiResponse.js

module.exports = {
  success(res, data = null, message = "OK") {
    res.json({
      success: true,
      message,
      data,
    });
  },

  error(res, message = "Internal Server Error", code = 500, details = null) {
    res.status(code).json({
      success: false,
      message,
      details,
    });
  },
};
return apiResponse.success(res, user, "User created");
