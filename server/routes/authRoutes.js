const express = require("express");
const router = express.Router();

const {
  authUser,
  authAdmin,
  logoutUser,
} = require("../controllers/authController");

// Student Login
router.post("/login", authUser);

// Admin Login
router.post("/admin-login", authAdmin);

// Logout
router.post("/logout", logoutUser);

module.exports = router;