const {superAdminOnly, protect} = require('../middleware/authMiddleware');
const express = require('express');
const route = express.Router();
const {createHostel} = require('../controllers/hostelController')

route.post('/',protect,superAdminOnly,createHostel);

module.exports=route;