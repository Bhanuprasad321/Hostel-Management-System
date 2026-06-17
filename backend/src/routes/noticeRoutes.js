const express = require("express");
const {
  protect,
  adminOnly,
  studentOnly,
} = require("../middleware/authMiddleware");
const route = express.Router();
const {
  createNotice,
  getNotices,
  deleteNotice,
} = require("../controllers/noticesController");

route.post("/", protect, adminOnly, createNotice);
route.get("/", protect, getNotices);
route.delete("/:id", protect, adminOnly, deleteNotice);

module.exports = route;
