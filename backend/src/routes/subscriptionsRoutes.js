const express = require("express");
const route = express.Router();
const { protect, superAdminOnly } = require("../middleware/authMiddleware");
const {
  getAllSubscriptions,
  getSubscriptionDetails,
  upgradePlan,
  renewalPlan,
} = require("../controllers/subscriptionsController");

route.get("/:id", protect, superAdminOnly, getSubscriptionDetails);
route.get("/", protect, superAdminOnly, getAllSubscriptions);
route.put("/:id/upgrade", protect, superAdminOnly, upgradePlan);
route.put("/:id/renewal", protect, superAdminOnly, renewalPlan);
module.exports = route;
