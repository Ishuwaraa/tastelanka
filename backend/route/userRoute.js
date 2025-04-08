const express = require('express');
const router = express.Router();
const users = require('../controller/userController');
const { verifyJwt } = require('../middleware/authMiddleware');
const { singleUpload } = require('../middleware/awsMiddleware');

router.post('/register', users.register);
router.post('/login', users.login);
router.get('/logout', users.logout);
router.get('/', verifyJwt, users.getUserData);
router.get('/restaurant', verifyJwt, users.getUserRestaurant);
router.patch('/', verifyJwt, users.updateUserData);
router.get("/check", verifyJwt, users.checkAuth);
router.post('/profilepic', verifyJwt, singleUpload, users.updateProfilePic);
router.patch('/pass', verifyJwt, users.updatePass);
router.post('/del', verifyJwt, users.deleteAcc);
router.post('/forgot-pass', users.forgotPass);
router.post('/reset-pass/:token', users.resetPass);

module.exports = router;