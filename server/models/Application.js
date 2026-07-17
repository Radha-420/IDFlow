const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Payment',
    },
    applicationStatus: {
      type: String,
      required: true,
      enum: [
        'Pending',
        'Under Verification',
        'Approved',
        'ID Card Printed',
        'Ready for Collection',
        'Collected',
        'Rejected',
      ],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      required: true,
      default: 'Paid',
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
