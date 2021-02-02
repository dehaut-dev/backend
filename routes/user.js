const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');        // controleur qui incremente les routes user

router.post('/signup', userCtrl.signup);            // inscription  
router.post('/login', userCtrl.login);              // connection 

module.exports = router;