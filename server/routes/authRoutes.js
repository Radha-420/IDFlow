const express = require("express");
const router = express.Router();

const {
  registerSendOtp,
  registerVerify,
  authUser,
  authAdmin,
  logoutUser,
  forgotPasswordSendOtp,
  forgotPasswordVerifyAndReset,
} = require("../controllers/authController");

// Register Routes
router.post("/register-send-otp", registerSendOtp);
router.post("/register-verify", registerVerify);

// Forgot Password Routes
router.post("/forgot-password-send-otp", forgotPasswordSendOtp);
router.post("/forgot-password-verify-and-reset", forgotPasswordVerifyAndReset);

// Student Login
router.post("/login", authUser);

// Admin Login
router.post("/admin-login", authAdmin);

// Logout
router.post("/logout", logoutUser);

module.exports = router;