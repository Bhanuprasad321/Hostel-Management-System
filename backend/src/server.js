require("dotenv").config();
const { connectSql } = require("./config/mysql");

connectSql();
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const hostelRoutes = require("./routes/hostelRoutes");
const studentRoutes = require("./routes/studentsRoutes");
const roomRoutes = require("./routes/roomRoutes");
const allocationRoutes = require("./routes/allocationsRoutes");
const dashBoardRoutes = require("./routes/dashBoardRoutes");
const subscriptionsRoutes = require("./routes/subscriptionsRoutes");
const auditLogsRoutes = require("./routes/auditLogsRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("This is Home page of the website");
  res.json("Hello");
});

app.use("/api/auth", authRoutes);
app.use("/api", authRoutes); //testing
app.use("/api/hostels", hostelRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/dashboard", dashBoardRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/audit-logs", auditLogsRoutes);

app.listen(2000, () => {
  console.log(`App is running at port ${2000}`);
});
