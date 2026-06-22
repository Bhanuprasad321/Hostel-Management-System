const express = require("express");
const route = express.Router();
const {
  protect,
  superAdminOnly,
  adminOnly,
} = require("../middleware/authMiddleware");
const {
  getAllSubscriptions,
  getSubscriptionDetails,
  subscriptionHistory,
  purchasePlan,
  currentPlan,
  getPaymentHistory,
} = require("../controllers/subscriptionsController");

route.put("/:id/purchase", protect, adminOnly, purchasePlan);
route.get("/current", protect, adminOnly, currentPlan);
route.get("/history", protect, adminOnly, subscriptionHistory);
route.get("/PaymentHistory", protect, getPaymentHistory);
route.get("/:id", protect, superAdminOnly, getSubscriptionDetails);
route.get("/", protect, superAdminOnly, getAllSubscriptions);

module.exports = route;
