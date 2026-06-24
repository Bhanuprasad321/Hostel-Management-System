const express = require("express");
const { protect, superAdminOnly } = require("../middleware/authMiddleware");
const {
  GetDemoRequests,
  createDemoRequest,
  updateDemoStatus,
} = require("../controllers/homeController");

const route = express.Router();

route.post("/", createDemoRequest);
route.put("/:id", protect, superAdminOnly, updateDemoStatus);
route.get("/", protect, superAdminOnly, GetDemoRequests);

module.exports = route;
