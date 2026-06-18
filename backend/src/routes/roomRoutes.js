const express = require("express");
const route = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  createRoom,
  getAllRooms,
  getRoomDetails,
  updateRoom,
} = require("../controllers/roomController");

route.post("/", protect, adminOnly, createRoom);
route.get("/:id", protect, adminOnly, getRoomDetails);
route.put("/:id", protect, adminOnly, updateRoom);
route.get("/", protect, adminOnly, getAllRooms);

module.exports = route;
