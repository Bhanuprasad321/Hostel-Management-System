const express = require("express");
const route = express.Router();
const { createStudent, getStudents, getStudentDetails } = require("../controllers/studentsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

route.post("/", protect, adminOnly, createStudent);
route.get("/",protect,adminOnly,getStudents);
route.get("/:id",protect,adminOnly,getStudentDetails);
module.exports = route;
