const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000']
    }
});

//to store online users
const userSocketMap = {};

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
}

io.on('connection', (socket) => {
    //in development mode this will get twice for each user. 
    //if removed the strictmode in the frontend main.jsx it won't happen
    console.log('a user connected', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    //to send to all connected users
    //io.emit('getOnlineUsers', Object.keys(userSocketMap)); //sending only the keys. keys are userids

    socket.on('disconnect', () => {
        console.log('a user disconnected', socket.id);

        delete userSocketMap[userId]    //remove userid when logging out
    })
});

module.exports = { io, app, server, getReceiverSocketId }