const User = require("../models/User");
const OTP = require("../models/OTP");
const generateToken = require("../utils/generateToken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// ===============================
// Send Registration OTP
// POST /api/auth/register-send-otp
// ===============================
const registerSendOtp = async (req, res) => {
  const { rollNumber, email, password } = req.body;

  try {
    // Basic validation
    if (!rollNumber || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    // Verify email matches PIN Number structure
    const expectedEmail = `${rollNumber.toLowerCase()}@adityauniversity.in`;
    if (email.toLowerCase() !== expectedEmail) {
      return res.status(400).json({ 
        message: `Email must be ${expectedEmail}` 
      });
    }

    // Check if user already registered
    const userExists = await User.findOne({ collegeId: rollNumber, role: "student" });
    if (userExists) {
      return res.status(400).json({ message: "Student already registered. Please login." });
    }

    // Check if student exists in the raw university database
    const studentsCollection = mongoose.connection.collection("students");
    const rawStudent = await studentsCollection.findOne({ rollNumber: rollNumber });
    if (!rawStudent) {
      return res.status(400).json({ message: "PIN Number not found in the university database." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database (overwrites existing unverified OTPs for this email)
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      rollNumber,
      otp,
      password // storing password temporarily until verification
    });

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "IDFlow Registration - Verification Code",
      html: `
        <h2>Verify Your Email</h2>
        <p>Your one-time password (OTP) for IDFlow registration is:</p>
        <h1 style="color: #3b82f6; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent successfully to your university email." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error while sending email." });
  }
};

// ===============================
// Verify OTP & Register
// POST /api/auth/register-verify
// ===============================
const registerVerify = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the OTP record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Fetch the raw student details from the university database
    const studentsCollection = mongoose.connection.collection("students");
    const rawStudent = await studentsCollection.findOne({ rollNumber: otpRecord.rollNumber });

    if (!rawStudent) {
      return res.status(400).json({ message: "Student record no longer exists in database." });
    }

    // Create the User in our system
    const user = await User.create({
      role: "student",
      name: rawStudent.name || "",
      email: otpRecord.email,
      password: otpRecord.password, // This will be hashed by the User model's pre-save hook
      phone: rawStudent.phone ? rawStudent.phone.toString() : "",
      collegeId: otpRecord.rollNumber,
      department: rawStudent.Department || rawStudent.department || "",
      branch: rawStudent.Branch || rawStudent.branch || "",
      year: rawStudent.year ? rawStudent.year.toString() : "",
    });

    // Clean up OTP
    await OTP.deleteMany({ email });

    // Generate JWT and log them in immediately
    generateToken(res, user._id, user.role);

    return res.status(201).json({
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
    return res.status(500).json({ message: "Server Error during verification." });
  }
};

// ===============================
// Student Login
// POST /api/auth/login
// ===============================
const authUser = async (req, res) => {
  const { collegeId, password } = req.body;

  try {
    // Check if user is registered in our users collection
    const user = await User.findOne({
      collegeId: collegeId,
      role: "student",
    });

    if (!user) {
      return res.status(401).json({
        message: "Student not registered. Please register first.",
      });
    }

    // Verify password securely
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid PIN Number or Password",
      });
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
  registerSendOtp,
  registerVerify,
  authUser,
  authAdmin,
  logoutUser,
};