const express = require('express');
const router = express.Router();
const chats = require('../controller/chatController');
const { verifyJwt } = require('../middleware/authMiddleware');

router.get('/users', verifyJwt, chats.getUsersForSideBar);
router.post('/send/:id', verifyJwt, chats.sendMessage);
router.get('/:id', verifyJwt, chats.getMessages);

module.exports = router;