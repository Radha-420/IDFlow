const User = require("../models/User");
const Application = require("../models/Application");
const Payment = require("../models/Payment");

// ==========================================
// Get Student Profile
// ==========================================
const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// Update Profile
// ==========================================
const updateStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      collegeId: updatedUser.collegeId,
      department: updatedUser.department,
      branch: updatedUser.branch,
      year: updatedUser.year,
      photo: updatedUser.photo,
      role: updatedUser.role,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// Dashboard
// ==========================================
const getStudentDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const application = await Application.findOne({
      student: req.user._id,
    }).sort({ createdAt: -1 });

    const payments = await Payment.find({
      student: req.user._id,
    });

    res.json({
      student: user,

      application,

      paymentsCount: payments.length,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// Apply ID Card
// ==========================================
const applyForIdCard = async (req, res) => {

  try {

    const { paymentId } = req.body;

    const existing = await Application.findOne({
      student: req.user._id,
      applicationStatus: {
        $nin: ["Rejected", "Collected"],
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Application already exists",
      });
    }

    const payment = await Payment.findOne({
      paymentId,
      student: req.user._id,
    });

    if (!payment) {
      return res.status(400).json({
        message: "Payment not found",
      });
    }

    const application = await Application.create({

      applicationNumber:
        "APP" + Date.now().toString().slice(-6),

      student: req.user._id,

      payment: payment._id,

      paymentStatus:
        payment.status == "Success"
          ? "Paid"
          : "Failed",

    });

    res.status(201).json(application);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ==========================================
// Status
// ==========================================
const getApplicationStatus = async (req, res) => {

  try {

    const application =
      await Application.findOne({
        student: req.user._id,
      }).sort({ createdAt: -1 }).populate("payment");

    if (!application) {

      return res.status(404).json({
        message: "No Application Found",
      });

    }

    res.json(application);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

// ==========================================
// Payment History
// ==========================================
const getPaymentHistory = async (req, res) => {

  try {

    const payments = await Payment.find({
      student: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(payments);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
  applyForIdCard,
  getApplicationStatus,
  getPaymentHistory,
};