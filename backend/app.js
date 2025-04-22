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
const User = require('./models/user.model');

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const userRouter = require('./router/user.route');
const sessionRouter = require('./router/session.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/profilepicture', express.static('profilePicture'));

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/forest_app';

mongoose.connect(MONGO_URI)
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
        const thisSession = await Session.findOne({ _id: room });;
        if (!thisSession) {
            console.error('Session not found:', room);
            return;
        }
        if (!thisSession.userId.includes(userId)) {
            console.error('User not authorized for this session:', userId);
            socket.emit('userNotAllowed');
            return;
        }
        const sessionPopulated = await Session.findOne({ _id: room }).populate('userId', 'username profilePicture');
        if (!sessionPopulated) {
            console.error('Session not found:', room);
            return;
        }
        socket.emit('userConnect', sessionPopulated.userId);
        socket.to(room).emit('userConnect', sessionPopulated.userId);
        socket.join(room);
    });

    socket.on('startSession', async (room) => {
        const thisSession = await Session.findOne({ _id: room});
        if (!thisSession) {
            console.error('Session not found:', room);
            return;
        }
        console.log('Session found:', thisSession);
        thisSession.status = 'started';
        thisSession.startedAt = new Date();
        thisSession.endAt = new Date(Date.now() + thisSession.time * 60000);
        await thisSession.save();
        // Create a text timer for the session in the format of mm:ss
        let minutes = Math.floor(thisSession.time / 60);
        let seconds = thisSession.time % 60;
        let timer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        socket.emit('sessionStarted', timer);
        socket.to(room).emit('sessionStarted', timer);
    });

    setInterval(async () => {
        const sessions = await Session.find({ status: 'started' });
        const currentTime = new Date();
        sessions.forEach(session => {
            if (session.endAt <= currentTime) {
                session.status = 'done';
                session.save().then(() => {
                    io.to(session._id.toJSON()).emit('sessionEnded', session._id);
                });
            }
            else {
                const timeLeft = Math.floor((session.endAt - currentTime) / 1000);
                let minutes = Math.floor(timeLeft / 60);
                let seconds = timeLeft % 60;
                let percentage = Math.floor((timeLeft / (session.time * 60)) * 100);
                let timer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                socket.to(session._id.toJSON()).emit('sessionTimer', timer, percentage);
            }
        });
    }, 1000);
});

app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);

httpServer.listen(5000, () => {
    console.log(`Socket.IO server is running on port ${5000}`);
});