const express = require("express");
const {
  protect,
  adminOnly,
  superAdminOnly,
} = require("../middleware/authMiddleware");
const route = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getHostelSettings,
  updateHostelSettings,
} = require("../controllers/settingsController");
route.get("/profile", protect, getProfile);
route.put("/profile", protect, updateProfile);
route.put("/change-password", protect, changePassword);
route.get("/hostel", protect, adminOnly, getHostelSettings);
route.put("/hostel", protect, adminOnly, updateHostelSettings);
module.exports = route;
