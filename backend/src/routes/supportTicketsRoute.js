const express = require("express");
const {protect,superAdminOnly,adminOnly} = require("../middleware/authMiddleware");

const {createTicket,updateTicketStatus,getAllTickets,getTicketDetails,getMyTickets} = require('../controllers/supportTicketsController')

const route = express.Router();

route.post("/", protect, adminOnly, createTicket);
route.put("/:id/status", protect, superAdminOnly, updateTicketStatus);
route.get("/all", protect, superAdminOnly, getAllTickets);
route.get("/:id", protect, getTicketDetails);
route.get("/", protect, adminOnly, getMyTickets);

module.exports = route;
