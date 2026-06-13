const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const getAllNotifications = require("../controllers/notificationsController");
const route = express.Router();

route.get("/", protect, getAllNotifications);

module.exports = route;
