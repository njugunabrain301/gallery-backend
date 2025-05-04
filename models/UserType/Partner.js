const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema({});

const Partner = mongoose.model("Partner", PartnerSchema);
module.exports = Partner;
