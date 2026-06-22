const express = require("express");

const route = express.Router();

const { protect, superAdminOnly } = require("../middleware/authMiddleware");

const {
  getBusinessInsights,
} = require("../controllers/businessInsightController");

route.get("/", protect, superAdminOnly, getBusinessInsights);

module.exports = route;
