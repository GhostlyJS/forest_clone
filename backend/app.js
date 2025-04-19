const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const userRouter = require('./router/user.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/forest_app';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', userRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});