const express = require("express");
const route = express.Router();
const {
  createStudent,
  getStudents,
  getStudentDetails,
  getAllocationDetails,
  getStudentsDropdown,
} = require("../controllers/studentsController");
const {
  protect,
  adminOnly,
  studentOnly,
} = require("../middleware/authMiddleware");

route.post("/", protect, adminOnly, createStudent);
route.get("/dropdown", protect, adminOnly, getStudentsDropdown);
route.get("/:id", protect, adminOnly, getStudentDetails);
route.get("/allocation-details", protect, studentOnly, getAllocationDetails);
route.get("/", protect, adminOnly, getStudents);

module.exports = route;
