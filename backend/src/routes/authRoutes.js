const express = require('express');
const route = express.Router();
const {login,handleUser} = require('../controllers/authController');
const {protect} = require('../middleware/authMiddleware');
route.post('/login',login);
route.get('/users/me',protect,handleUser);
route.get('/test', (req,res)=>{
    res.send('Auth routes working');
});
module.exports = route;