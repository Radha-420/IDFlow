const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    transactionId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 100,
    },
    status: {
      type: String,
      required: true,
      enum: ['Success', 'Failed', 'Pending'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay',
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
