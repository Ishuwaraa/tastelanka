const express = require('express');
const router = express.Router();
const users = require('../controller/userController');

router.post('/register', users.registerUser);

module.exports = router;