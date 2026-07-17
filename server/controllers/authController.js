const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const mongoose = require("mongoose");

// ===============================
// Student Login
// POST /api/auth/login
// ===============================
const authUser = async (req, res) => {
  const { collegeId, password } = req.body;

  try {
    const studentsCollection = mongoose.connection.collection("students");

    // Check student credentials
    const rawStudent = await studentsCollection.findOne({
      rollNumber: collegeId,
      password: password,
    });

    if (!rawStudent) {
      return res.status(401).json({
        message: "Invalid PIN Number or Password",
      });
    }

    // Check if user already exists
    let user = await User.findOne({
      collegeId: collegeId,
      role: "student",
    });

    if (!user) {
      // Create new user
      user = await User.create({
        role: "student",
        name: rawStudent.name,
        email: rawStudent.email,
        password: password,
        phone: rawStudent.phone ? rawStudent.phone.toString() : "",
        collegeId: rawStudent.rollNumber,
        department: rawStudent.Department || rawStudent.department || "",
        branch: rawStudent.Branch || rawStudent.branch || "",
        year: rawStudent.year ? rawStudent.year.toString() : "",
      });
    } else {
      // Update latest student details
      user.name = rawStudent.name;
      user.email = rawStudent.email;
      user.phone = rawStudent.phone ? rawStudent.phone.toString() : "";
      user.department =
        rawStudent.Department || rawStudent.department || "";
      user.branch =
        rawStudent.Branch || rawStudent.branch || "";
      user.year = rawStudent.year
        ? rawStudent.year.toString()
        : "";

      await user.save();
    }

    // Generate JWT
    generateToken(res, user._id, user.role);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      collegeId: user.collegeId,
      department: user.department,
      branch: user.branch,
      year: user.year,
      photo: user.photo,
      role: user.role,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Admin Login
// ===============================
const authAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const mongoose = require("mongoose");
    const adminCollection = mongoose.connection.collection("admin");
    
    // Find admin by email in the custom 'admin' collection
    const rawAdmin = await adminCollection.findOne({ email });

    // Check if admin exists and password matches (plaintext comparison since user inserted directly)
    if (!rawAdmin || rawAdmin.password !== password) {
      return res.status(401).json({
        message: "Invalid Admin Email or Password",
      });
    }

    generateToken(res, rawAdmin._id, "admin");

    return res.json({
      _id: rawAdmin._id,
      name: rawAdmin.name || "Admin",
      email: rawAdmin.email,
      role: "admin",
      photo: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Logout
// ===============================
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({
    message: "Logged Out Successfully",
  });
};

module.exports = {
  authUser,
  authAdmin,
  logoutUser,
};