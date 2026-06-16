const express = require("express");
const route = express.Router();
const {
  getSuperAdminDashboardStats,
  getAdminDashbordStats,
  getStudentDashboardStats,
} = require("../controllers/dashBoardController");
const {
  protect,
  superAdminOnly,
  adminOnly,
  studentOnly,
} = require("../middleware/authMiddleware");

route.get("/super-admin", protect, superAdminOnly, getSuperAdminDashboardStats);
route.get("/hostel-admin", protect, adminOnly, getAdminDashbordStats);
route.get("/student", protect, studentOnly, getStudentDashboardStats);
module.exports = route;
