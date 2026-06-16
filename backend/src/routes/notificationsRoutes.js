const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getAllNotifications,
  markAsRead,
  markAllRead,
} = require("../controllers/notificationsController");
const route = express.Router();

route.get("/", protect, getAllNotifications);
route.put("/:id/read", protect, markAsRead);
route.put("/read-all", protect, markAllRead);
module.exports = route;
