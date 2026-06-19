const express = require("express");
const route = express.Router();

const {
  protect,
  superAdminOnly,
  adminOnly,
} = require("../middleware/authMiddleware");
const {
  createPlan,
  updatePlan,
  getPlans,
  deletePlan,
  getAdminPlan,
} = require("../controllers/plansController");

route.get("/admin", protect, getAdminPlan);

route.get("/", protect, getPlans);
route.post("/", protect, superAdminOnly, createPlan);

route.put("/:id", protect, superAdminOnly, updatePlan);
route.delete("/:id", protect, superAdminOnly, deletePlan);

module.exports = route;
