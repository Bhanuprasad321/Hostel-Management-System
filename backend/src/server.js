const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

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
const notificationsRoutes = require("./routes/notificationsRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const complaintsRoutes = require("./routes/complaintsRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const visitorsRoutes = require("./routes/visitorsRoutes");
const plansRoutes = require("./routes/plansRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const businessInsights = require("./routes/businessInsightRoute");
const supportTickets = require("./routes/supportTicketsRoute");
const fees = require("./routes/feesRoutes");
const demoRequests = require("./routes/homeRoutes");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
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
app.use("/api/notifications", notificationsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/visitors", visitorsRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/businessInsights", businessInsights);
app.use("/api/supportTickets", supportTickets);
app.use("/api/fees", fees);
app.use("/api/demos", demoRequests);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`App is running at port ${PORT}`);
});
