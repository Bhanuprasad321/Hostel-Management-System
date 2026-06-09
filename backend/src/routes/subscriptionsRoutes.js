const express = require('express')
const route = express.Router();
const { protect, superAdminOnly } = require('../middleware/authMiddleware');
const { getAllSubscriptions, getSubscriptionDetails } = require('../controllers/subscriptionsController')


route.get('/',protect,superAdminOnly,getAllSubscriptions);
route.get('/:id',protect,superAdminOnly,getSubscriptionDetails);


module.exports = route;