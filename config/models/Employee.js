const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    loginId: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true }, // hashed
    role: { type: String, enum: ["admin", "employee"], default: "employee" },

    profilePicture: { type: String, default: "" },
    department: { type: String, default: "" },
    manager: { type: String, default: "" },
    joiningDate: { type: Date, default: Date.now },

    // Private info
    address: { type: String, default: "" },

    // Salary Info - admin only
    monthlyWage: { type: Number, default: 0 },
    yearlyWage: { type: Number, default: 0 },
    compensationType: {
      type: String,
      enum: ["fixed", "percentage"],
      default: "fixed",
    },
    salaryComponents: {
      basicSalary: { type: Number, default: 0 },
      hra: { type: Number, default: 0 },
      standardAllowance: { type: Number, default: 0 },
      leaveTravelAllowance: { type: Number, default: 0 },
      foodAllowance: { type: Number, default: 0 },
    },
    pfContribution: {
      employee: { type: Number, default: 0 },
      employer: { type: Number, default: 0 },
    },
    professionalTax: { type: Number, default: 200 },

    // Time off allocation
    timeOffBalance: {
      paidTimeOff: { type: Number, default: 24 },
      sickLeave: { type: Number, default: 7 },
      unpaidLeave: { type: Number, default: 0 },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
