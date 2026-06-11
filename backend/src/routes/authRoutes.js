const express = require("express");
const route = express.Router();
const { login, handleUser } = require("../controllers/authController");
const { protect, superAdminOnly } = require("../middleware/authMiddleware");
route.post("/login", login);

module.exports = route;
