const User = require('../models/User');
const Application = require('../models/Application');
const Payment = require('../models/Payment');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboard = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const totalStudents = await mongoose.connection.collection('students').countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingApps = await Application.countDocuments({ applicationStatus: 'Pending' });
    const approvedApps = await Application.countDocuments({ applicationStatus: 'Approved' });
    const rejectedApps = await Application.countDocuments({ applicationStatus: 'Rejected' });
    const readyApps = await Application.countDocuments({ applicationStatus: 'Ready for Collection' });
    
    const payments = await Payment.find({ status: 'Success' });
    const revenueCollected = payments.reduce((acc, payment) => acc + payment.amount, 0);

    const recentApplications = await Application.find()
      .populate('student', 'name collegeId')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalStudents,
        totalApplications,
        pendingApps,
        approvedApps,
        rejectedApps,
        readyApps,
        revenueCollected,
      },
      recentApplications,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private (Admin)
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name collegeId department branch year photo')
      .populate('payment')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update application status
// @route   PUT /api/admin/application/:id
// @access  Private (Admin)
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const application = await Application.findById(req.params.id);

    if (application) {
      application.applicationStatus = status || application.applicationStatus;
      const updatedApplication = await application.save();

      // In a real app, create a notification record here
      
      res.json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete application (Optional)
// @route   DELETE /api/admin/application/:id
// @access  Private (Admin)
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (application) {
      await application.deleteOne();
      res.json({ message: 'Application removed' });
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private (Admin)
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('student', 'name collegeId')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
const getStudents = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const studentsCollection = mongoose.connection.collection('students');
    const students = await studentsCollection.find({}).toArray();

    // Map the raw students collection fields to the format expected by the frontend
    const mappedStudents = students.map(student => ({
      _id: student._id,
      name: student.name || 'Unknown',
      email: student.email || 'N/A',
      collegeId: student.rollNumber || student.collegeId || 'N/A',
      department: student.Department || student.department || 'N/A',
      branch: student.Branch || student.branch || '',
      year: student.year ? student.year.toString() : 'N/A',
      phone: student.phone ? student.phone.toString() : 'N/A',
      photo: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    }));

    res.json(mappedStudents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAdminDashboard,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  getPayments,
  getStudents,
};
