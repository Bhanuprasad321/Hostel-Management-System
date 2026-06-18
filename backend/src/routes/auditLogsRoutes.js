const express = require("express");
const { protect, superAdminOnly } = require("../middleware/authMiddleware");
const getAuditLogs = require("../controllers/auditLogsController");
const route = express.Router();

route.get("/", protect, getAuditLogs);

module.exports = route;
