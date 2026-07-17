const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');

// Mock setup for Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'mock_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret',
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private (Student)
const createOrder = async (req, res) => {
  try {
    const options = {
      amount: 100 * 100, // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    // If you don't have valid Razorpay keys, mock the response
    if (process.env.RAZORPAY_KEY_ID === 'mock_rzp_test_key_123') {
      return res.json({
        id: `order_${Date.now()}`,
        currency: 'INR',
        amount: 10000,
      });
    }

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order', details: error.error || error.message || error });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private (Student)
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // For mock keys, bypass verification
    let isAuthentic = true;

    if (process.env.RAZORPAY_KEY_ID !== 'mock_rzp_test_key_123') {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      isAuthentic = expectedSignature === razorpay_signature;
    }

    if (isAuthentic) {
      // Save payment in DB
      const payment = await Payment.create({
        student: req.user._id,
        transactionId: razorpay_payment_id || `txn_${Date.now()}`,
        orderId: razorpay_order_id || `order_${Date.now()}`,
        paymentId: razorpay_payment_id || `pay_${Date.now()}`,
        amount: 100,
        status: 'Success',
        paymentMethod: 'Razorpay',
      });

      res.status(200).json({
        message: 'Payment verified successfully',
        payment,
      });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during payment verification' });
  }
};

// @desc    Get Razorpay Config
// @route   GET /api/payment/config
// @access  Private (Student)
const getRazorpayConfig = (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID || 'mock_rzp_test_key_123' });
};

module.exports = {
  createOrder,
  verifyPayment,
  getRazorpayConfig,
};
