const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const {Server} = require('socket.io');
const { createServer } = require('http');
const httpServer = createServer(app);
const jsonwebsocket = require('jsonwebtoken');
const Session = require('./models/session.model');

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const userRouter = require('./router/user.route');
const sessionRouter = require('./router/session.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/forest_app';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    socket.on('connectToRoom', async (room, token) => {
        const decodedToken = jsonwebsocket.verify(token, "forest");
        if (!decodedToken) {
            console.error('Invalid token:', token);
            return;
        }
        const userId = decodedToken.id;
        const thisSession = await Session.findOne({ _id: room });
        if (!thisSession) {
            console.error('Session not found:', room);
            return;
        }
        if (!thisSession.userId.includes(userId)) {
            console.error('User not authorized for this session:', userId);
            socket.emit('userNotAllowed');
            return;
        }
        socket.join(room);
    });
});

app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);

httpServer.listen(5000, () => {
    console.log(`Socket.IO server is running on port ${5000}`);
});