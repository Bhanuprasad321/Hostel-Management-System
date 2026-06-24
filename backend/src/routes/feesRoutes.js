const express = require("express");
const route = express.Router();

const {
  protect,
  adminOnly,
  studentOnly,
} = require("../middleware/authMiddleware");

const {
  markFeePaid,
  createFeeSettings,
  updateFeeSettings,
  getAllFees,
  getFeeSettings,
  getMyFees,
  getFeeAnalytics,
  getRecentFeeActivity,
} = require("../controllers/feesController");

route.put("/pay/:id", protect, adminOnly, markFeePaid);
route.post("/", protect, adminOnly, createFeeSettings);
route.put("/", protect, adminOnly, updateFeeSettings);
route.get("/all-fees", protect, adminOnly, getAllFees);
route.get("/my-fees", protect, studentOnly, getMyFees);
route.get("/fee-analytics", protect, adminOnly, getFeeAnalytics);
route.get("/recect-fee-activities", protect, adminOnly, getRecentFeeActivity);
route.get("/", protect, adminOnly, getFeeSettings);

module.exports = route;
