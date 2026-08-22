require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Dayflow HRMS API is running");
});

app.use("/api/attendance", require("./routes/attendance"));

// TODO (team - split these up):
// app.use("/api/employees", require("./routes/employees"));   -> profile view/edit
// app.use("/api/attendance", require("./routes/attendance"));  -> check-in/out, daily/weekly view
// app.use("/api/timeoff", require("./routes/timeoff"));        -> apply/approve/reject leave
// app.use("/api/payroll", require("./routes/payroll"));        -> admin salary view/edit

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
