const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getRazorpayConfig } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/config', protect, getRazorpayConfig);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
