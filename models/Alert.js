const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  msg: { type: String, required: true },
  vibA: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", AlertSchema);
