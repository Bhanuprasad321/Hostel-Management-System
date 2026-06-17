const express = require("express");
const route = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  createVisitor,
  getVisitors,
  checkoutVisitor,
} = require("../controllers/visitorsController");

route.post("/", protect, adminOnly, createVisitor);

route.get("/", protect, adminOnly, getVisitors);

route.put("/:id/checkout", protect, adminOnly, checkoutVisitor);

module.exports = route;
