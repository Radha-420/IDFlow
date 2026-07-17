const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  getPayments,
  getStudents,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getAdminDashboard);
router.get('/students', protect, admin, getStudents);
router.route('/applications')
  .get(protect, admin, getApplications);
  
router.route('/application/:id')
  .put(protect, admin, updateApplicationStatus)
  .delete(protect, admin, deleteApplication);

router.get('/payments', protect, admin, getPayments);

module.exports = router;
