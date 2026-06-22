const express = require("express");
const { protect, superAdminOnly,checkFeature } = require("../middleware/authMiddleware");
const getAuditLogs = require("../controllers/auditLogsController");
const route = express.Router();

route.get("/", protect,checkFeature('audit_logs'), getAuditLogs);

module.exports = route;
