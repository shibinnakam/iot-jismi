// ===== Imports =====
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// ===== Load environment variables =====
dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ===== Express setup =====
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== MongoDB connection =====
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===== Import model =====
const Alert = require("./models/Alert");

// ===== ESP32 sends alert =====
app.get("/alert", async (req, res) => {
  const { msg, vibA } = req.query;

  if (!msg) return res.status(400).json({ error: "Missing msg parameter" });

  try {
    const alert = new Alert({
      msg,
      vibA: vibA ? Number(vibA) : 0
    });
    await alert.save();
    console.log(`[ALERT] ${new Date().toLocaleString()} - ${msg} (vibA=${vibA})`);
    res.json({ status: "ok", saved: alert });
  } catch (err) {
    console.error("Error saving alert:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== Get latest alert =====
app.get("/data", async (req, res) => {
  try {
    const latest = await Alert.findOne().sort({ timestamp: -1 });
    res.json(latest || { msg: "No data yet" });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// ===== Get alert history =====
app.get("/history", async (req, res) => {
  try {
    const history = await Alert.find().sort({ timestamp: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
