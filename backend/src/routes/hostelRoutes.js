const { superAdminOnly, protect } = require("../middleware/authMiddleware");
const express = require("express");
const route = express.Router();
const { createHostel, getHostels } = require("../controllers/hostelController");

route.post("/", protect, superAdminOnly, createHostel);
route.get("/", protect, superAdminOnly, getHostels);

module.exports = route;
