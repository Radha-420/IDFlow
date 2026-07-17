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
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
  .get(protect, getStudentProfile)
  .put(protect, updateStudentProfile);

router.get('/dashboard', protect, getStudentDashboard);
router.post('/apply', protect, applyForIdCard);
router.get('/status', protect, getApplicationStatus);
router.get('/payment-history', protect, getPaymentHistory);

module.exports = router;
