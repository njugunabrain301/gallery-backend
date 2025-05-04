const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  otherNames: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["customer", "partner", "admin"],
    required: true,
  },
  documentType: {
    type: String,
    enum: ["ID", "Passport", "Driving License"],
  },
  documentNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  customerDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  dateOfBirth: {
    type: Date,
  },
  partnerDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },
  adminDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  employmentStatus: {
    type: String,
    enum: ["employed", "self-employed", "unemployed"],
    required: true,
  },
  employerName: {
    type: String,
    required: function () {
      return this.employmentStatus === "employed";
    },
  },
  natureOfBusiness: {
    type: String,
    required: function () {
      return this.employmentStatus === "self-employed";
    },
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
