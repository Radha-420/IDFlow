const express = require("express");
const router = express.Router();

const {
  registerSendOtp,
  registerVerify,
  authUser,
  authAdmin,
  logoutUser,
} = require("../controllers/authController");

// Register Routes
router.post("/register-send-otp", registerSendOtp);
router.post("/register-verify", registerVerify);

// Student Login
router.post("/login", authUser);

// Admin Login
router.post("/admin-login", authAdmin);

// Logout
router.post("/logout", logoutUser);

module.exports = router;