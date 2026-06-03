const express = require('express')
const route = express.Router();
const { getSuperAdminDashboardStats, getAdminDashbordStats } = require('../controllers/dashBoardController');
const {protect,superAdminOnly,adminOnly} = require('../middleware/authMiddleware');


route.get('/super-admin',protect,superAdminOnly,getSuperAdminDashboardStats);
route.get('/hostel-admin',protect,adminOnly,getAdminDashbordStats);

module.exports = route;