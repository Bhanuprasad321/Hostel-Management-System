const express = require("express");
const route = express.Router();

const {
  protect,
  adminOnly,
  checkFeature,
} = require("../middleware/authMiddleware");
const {
  exportStudents,
  exportAllocations,
  exportVisitors,
} = require("../controllers/reportsController");

route.get(
  "/students",
  protect,
  adminOnly,
  checkFeature("exports"),
  exportStudents,
);

route.get(
  "/allocations",
  protect,
  adminOnly,
  checkFeature("exports"),
  exportAllocations,
);

route.get(
  "/visitors",
  protect,
  adminOnly,
  checkFeature("exports"),
  exportVisitors,
);

module.exports = route;
