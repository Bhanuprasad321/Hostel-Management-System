const { superAdminOnly, protect } = require("../middleware/authMiddleware");
const express = require("express");
const route = express.Router();
const {
  createHostel,
  getHostels,
  createHostelAdmin,
  getHostelAdmins,
  updateHostel,
} = require("../controllers/hostelController");

route.post("/:id/admin/", protect, superAdminOnly, createHostelAdmin);
route.post("/", protect, superAdminOnly, createHostel);
route.put("/:id", protect, superAdminOnly, updateHostel);
route.get("/:id/admin/", protect, superAdminOnly, getHostelAdmins);
route.get("/", protect, superAdminOnly, getHostels);

module.exports = route;
