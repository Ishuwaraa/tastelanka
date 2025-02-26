const express = require('express');
const router = express.Router();
const users = require('../controller/userController');
const { verifyJwt } = require('../middleware/authMiddleware');

router.post('/register', users.register);
router.post('/login', users.login);
router.get('/logout', users.logout);
router.get('/', verifyJwt, users.getUserData);
router.patch('/', verifyJwt, users.updateUserData);
router.patch('/pass', verifyJwt, users.updatePass);
router.post('/del', verifyJwt, users.deleteAcc);
router.post('/forgot-pass', users.forgotPass);
router.post('/reset-pass/:token', users.resetPass);

module.exports = router;