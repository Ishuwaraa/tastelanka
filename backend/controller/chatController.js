const User = require('../model/UserModel');
const Chat = require('../model/ChatModel');
const { getReceiverSocketId, io } = require('../lib/socket');

const getUsersForSideBar = async (req, res) => {
    const currUserId = req.userid;
    const role = req.role;

    try {        
        const chats = await Chat.find({
            $or: [{ sender: currUserId }, { receiver: currUserId }]
        });

        const userIds = new Set();
        chats.forEach(chat => {
            if (chat.sender.toString() !== currUserId) userIds.add(chat.sender.toString());
            if (chat.receiver.toString() !== currUserId) userIds.add(chat.receiver.toString());
        });

        const users = await User.find({ _id: { $in: Array.from(userIds) } }).select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const getMessages = async (req, res) => {
    const currUserId = req.userid;
    const role = req.role;
    const { id: userToChatId } = req.params;

    try {
        //find all the messages where either i'm the sender or vice versa
        const messages = await Chat.find({
            $or: [
                { sender: currUserId, receiver: userToChatId },
                { sender: userToChatId, receiver: currUserId },
            ],
        }).populate("sender", "-password").populate("receiver", "-password");
    
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const sendMessage = async (req, res) => {
    const currUserId = req.userid;
    const role = req.role;
    const { id: receiverId } = req.params;
    const data = req.body;

    try {
        let newMessage = await Chat.create({
            sender: currUserId,
            receiver: receiverId,
            text: data.text
        })

        // newMessage = await newMessage.populate("sender", "-password");
        // newMessage = await newMessage.populate("receiver", "-password");

        const sender = await User.findById(currUserId);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", { text: newMessage, sender: sender.name });
        }

        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = { getUsersForSideBar, getMessages, sendMessage }