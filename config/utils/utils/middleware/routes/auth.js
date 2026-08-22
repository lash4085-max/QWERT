const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const generateLoginId = require("../utils/generateLoginId");

const router = express.Router();

function signToken(employee) {
  return jwt.sign(
    { id: employee._id, role: employee.role, loginId: employee.loginId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// @route   POST /api/auth/signup
// @desc    Register a new employee/admin. System auto-generates loginId + password on first setup.
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const loginId = await generateLoginId(firstName, lastName, new Date());
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      loginId,
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "employee",
    });

    const token = signToken(employee);

    res.status(201).json({
      token,
      user: {
        id: employee._id,
        loginId: employee.loginId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/auth/signin
// @desc    Login using email + password
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(employee);

    res.json({
      token,
      user: {
        id: employee._id,
        loginId: employee.loginId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
