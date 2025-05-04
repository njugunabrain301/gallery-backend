const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    // Reference to the Application
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      //   required: true,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      //   required: true,
    },
    // Payment details
    amount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["booking", "balance", "extension", "assessment"],
      required: true,
    },

    // MPESA STK Push details
    CheckoutRequestID: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },

    // Raw MPESA responses
    stkRequest: {
      type: Object,
      default: {},
    },
    stkCallback: {
      type: Object,
      default: {},
    },
    queryResponse: {
      type: Object,
      default: {},
    },

    // Payment status
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    // Transaction tracking
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },

    // Additional metadata
    description: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Indexes for faster queries
PaymentSchema.index({ CheckoutRequestID: 1 });
PaymentSchema.index({ application: 1 });
PaymentSchema.index({ status: 1 });

// Methods
PaymentSchema.methods.markAsCompleted = async function () {
  this.status = "completed";
  this.processedAt = new Date();
  await this.save();
};

PaymentSchema.methods.markAsFailed = async function () {
  this.status = "failed";
  this.processedAt = new Date();
  await this.save();
};

// Static methods
PaymentSchema.statics.findByCheckoutRequestId = function (checkoutRequestId) {
  return this.findOne({ CheckoutRequestID: checkoutRequestId });
};

PaymentSchema.statics.getApplicationPayments = function (applicationId) {
  return this.find({
    application: applicationId,
  }).sort({ createdAt: -1 });
};

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
