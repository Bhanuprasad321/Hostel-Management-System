const { superAdminOnly, protect } = require("../middleware/authMiddleware");
const express = require("express");
const route = express.Router();
const { createHostel, getHostels,createHostelAdmin,getHostelAdmins } = require("../controllers/hostelController");

route.post("/", protect, superAdminOnly, createHostel);
route.get("/:id/admin/",protect,superAdminOnly,getHostelAdmins);
route.get("/", protect, superAdminOnly, getHostels);
route.post("/:id/admin/",protect,superAdminOnly,createHostelAdmin);


module.exports = route;
