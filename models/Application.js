const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  bookingFee: {
    type: Number,
    required: true,
  },
  deliveredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  totalFee: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  dateReservationPaid: {
    type: Date,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "approved",
      "rejected",
      "cancel-requested",
      "cancel-approved",
      "completed",
    ],
    default: "pending",
  },
  cancellationReason: {
    type: String,
  },
  cancellationRequestedAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  cancelledBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  cancellationNotes: {
    type: String,
  },
  refundAmount: {
    type: Number,
  },
  deliveryLocation: {
    address: String,
    county: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    label: String,
  },
  pickupLocation: {
    address: String,
    county: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    label: String,
  },
  additionalDocuments: [String],
  pendingExtension: {
    days: Number,
    fee: Number,
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    newEndDate: Date,
    newTotalFee: Number,
  },
  extensions: [
    {
      days: Number,
      fee: Number,
      paymentId: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
      extendedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  picturesOnDelivery: [
    {
      type: String, // URLs of the images
      required: true,
    },
  ],

  deliveryNotes: {
    type: String,
    trim: true,
  },
  deliveryDate: {
    type: Date,
  },
  clientAcknowledged: {
    type: Boolean,
    default: false,
  },
  clientAcknowledgedAt: {
    type: Date,
  },
  officialAcknowledged: {
    type: Boolean,
    default: false,
  },
  returnPictures: [
    {
      type: String, // URLs to stored images
    },
  ],
  returnedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
  rejectedAt: {
    type: Date,
  },
  rejectedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

ApplicationSchema.methods.addExtension = async function (days, fee, paymentId) {
  this.extensions.push({
    days,
    fee,
    paymentId,
    extendedAt: new Date(),
  });
  this.endDate = new Date(this.endDate.getTime() + days * 24 * 60 * 60 * 1000);
  this.totalFee += fee;
  await this.save();
};

ApplicationSchema.methods.setPendingExtension = async function (
  days,
  fee,
  paymentId,
  newEndDate
) {
  this.pendingExtension = {
    days,
    fee,
    paymentId,
    newEndDate,
    newTotalFee: this.totalFee + fee,
  };
  await this.save();
};

ApplicationSchema.methods.clearPendingExtension = async function () {
  this.pendingExtension = null;
  await this.save();
};

const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
