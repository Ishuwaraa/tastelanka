require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { app, io, server } = require('./lib/socket');

const userRoutes = require('./route/userRoute');
const restaurantRoutes = require('./route/restaurantRoute');
const reviewRoutes = require('./route/reviewRoute');
const chatRoutes = require('./route/chatRoute');

// const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));

mongoose.connect(process.env.DB_URI)
    .then(() => {
        server.listen(process.env.PORT, () => console.log("connected to db and listening on port: " , process.env.PORT))
    })
    .catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/chat', chatRoutes);