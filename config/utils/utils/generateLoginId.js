/**
 * Login ID format (from wireframe spec):
 * [Company Code][First 2 letters of First Name][First 2 letters of Last Name][Year of Joining][Serial No. of joining that year]
 *
 * Example: 02SDSD20260001
 *   02    -> Company Code
 *   SD    -> first 2 letters of first name
 *   SD    -> first 2 letters of last name
 *   2026  -> year of joining
 *   0001  -> serial number of joining, that year (zero-padded to 4 digits)
 */

const Employee = require("../models/Employee");

const COMPANY_CODE = process.env.COMPANY_CODE || "02";

async function generateLoginId(firstName, lastName, joiningDate = new Date()) {
  const year = joiningDate.getFullYear();

  const firstPart = firstName.substring(0, 2).toUpperCase().padEnd(2, "X");
  const lastPart = lastName.substring(0, 2).toUpperCase().padEnd(2, "X");

  // Count how many employees already joined in this year to get the next serial number
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const countThisYear = await Employee.countDocuments({
    joiningDate: { $gte: startOfYear, $lt: endOfYear },
  });

  const serial = String(countThisYear + 1).padStart(4, "0");

  return `${COMPANY_CODE}${firstPart}${lastPart}${year}${serial}`;
}

module.exports = generateLoginId;
