const express = require('express');
const router = express.Router();
const {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
  applyForIdCard,
  getApplicationStatus,
  getPaymentHistory,
} = require('../controllers/studentController');
const { protect, student } = require('../middleware/authMiddleware');

router.route('/profile')
  .get(protect, student, getStudentProfile)
  .put(protect, student, updateStudentProfile);

router.get('/dashboard', protect, student, getStudentDashboard);
router.post('/apply', protect, student, applyForIdCard);
router.get('/status', protect, student, getApplicationStatus);
router.get('/payment-history', protect, student, getPaymentHistory);

module.exports = router;
