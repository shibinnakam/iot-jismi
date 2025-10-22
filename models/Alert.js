const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  pir: Number,
  vibration: Number,
  vibAnalog: Number,
  msg: String,
  ip: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
