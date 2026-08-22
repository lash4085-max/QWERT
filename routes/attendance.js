const express = require("express");
const Attendance = require("../models/Attendance");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

function todayString() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

function hoursBetween(start, end) {
  return Math.round(((end - start) / (1000 * 60 * 60)) * 100) / 100;
}

// @route   POST /api/attendance/checkin
router.post("/checkin", protect, async (req, res) => {
  try {
    const date = todayString();
    const existing = await Attendance.findOne({ employee: req.user.id, date });

    if (existing && existing.checkIn) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const record = existing
      ? Object.assign(existing, { checkIn: new Date() })
      : new Attendance({ employee: req.user.id, date, checkIn: new Date() });

    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/attendance/checkout
router.post("/checkout", protect, async (req, res) => {
  try {
    const date = todayString();
    const record = await Attendance.findOne({ employee: req.user.id, date });

    if (!record || !record.checkIn) {
      return res.status(400).json({ message: "You haven't checked in yet today" });
    }
    if (record.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    record.checkOut = new Date();
    const totalHours = hoursBetween(record.checkIn, record.checkOut);

    record.workHours = Math.min(totalHours, 8);
    record.extraHours = Math.max(totalHours - 8, 0);

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/attendance/today
router.get("/today", protect, async (req, res) => {
  try {
    const date = todayString();
    const record = await Attendance.findOne({ employee: req.user.id, date });
    res.json(record || { checkedIn: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/attendance/me
router.get("/me", protect, async (req, res) => {
  try {
    const records = await Attendance.find({ employee: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/attendance/all
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const date = req.query.date || todayString();
    const records = await Attendance.find({ date }).populate(
      "employee",
      "firstName lastName loginId department"
    );
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
