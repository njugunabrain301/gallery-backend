const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  officeAddress: {
    type: String,
    required: true,
  },
});

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
