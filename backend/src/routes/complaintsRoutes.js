const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const route = express.Router();
const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintsController");
route.post("/", protect, createComplaint);
route.get("/", protect, adminOnly, getComplaints);
route.put("/:id/status", protect, adminOnly, updateComplaintStatus);

module.exports = route;
