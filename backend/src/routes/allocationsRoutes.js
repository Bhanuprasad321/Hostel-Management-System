const express = require('express');
const route = express.Router();
const {createAllocation, getAllAllocations, getAllocation, vacateStudent} = require('../controllers/allocationsController');
const {protect,adminOnly} = require('../middleware/authMiddleware');


route.post('/',protect,adminOnly,createAllocation);
route.get('/',protect,adminOnly,getAllAllocations);
route.get('/:id',protect,adminOnly,getAllocation);
route.put('/:id',protect,adminOnly,vacateStudent);



module.exports = route;