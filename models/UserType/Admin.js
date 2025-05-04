const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
