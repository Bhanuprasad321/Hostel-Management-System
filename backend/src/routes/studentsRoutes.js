const express = require("express");
const route = express.Router();
const {
  createStudent,
  getStudents,
  getStudentDetails,
  getAllocationDetails,
  getStudentsDropdown,
  updateStudent,
} = require("../controllers/studentsController");
const {
  protect,
  adminOnly,
  studentOnly,
} = require("../middleware/authMiddleware");

route.get("/allocation-details", protect, studentOnly, getAllocationDetails);
route.put("/:id", protect, adminOnly, updateStudent);
route.post("/", protect, adminOnly, createStudent);

route.get("/dropdown", protect, adminOnly, getStudentsDropdown);
route.get("/:id", protect, adminOnly, getStudentDetails);
route.get("/", protect, adminOnly, getStudents);
module.exports = route;
