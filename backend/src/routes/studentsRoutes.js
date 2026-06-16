const express = require("express");
const route = express.Router();
const {
  createStudent,
  getStudents,
  getStudentDetails,
  getAllocationDetails,
} = require("../controllers/studentsController");
const {
  protect,
  adminOnly,
  studentOnly,
} = require("../middleware/authMiddleware");

route.post("/", protect, adminOnly, createStudent);
route.get("/", protect, adminOnly, getStudents);
route.get("/allocation-details", protect, studentOnly, getAllocationDetails);
route.get("/:id", protect, adminOnly, getStudentDetails);

module.exports = route;
