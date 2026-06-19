const express = require("express");
const route = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  exportStudents,
  exportAllocations,
  exportVisitors,
} = require("../controllers/reportsController");

route.get("/students", protect, adminOnly, exportStudents);

route.get("/allocations", protect, adminOnly, exportAllocations);

route.get("/visitors", protect, adminOnly, exportVisitors);

module.exports = route;
