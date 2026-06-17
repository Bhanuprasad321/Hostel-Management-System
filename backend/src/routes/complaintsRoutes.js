const express = require("express");
const {
  protect,
  adminOnly,
  studentOnly,
} = require("../middleware/authMiddleware");
const route = express.Router();
const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  getMyComplaints,
} = require("../controllers/complaintsController");
route.post("/", protect, studentOnly, createComplaint);
route.get("/my", protect, studentOnly, getMyComplaints);
route.get("/", protect, adminOnly, getComplaints);
route.put("/:id/status", protect, adminOnly, updateComplaintStatus);

module.exports = route;
