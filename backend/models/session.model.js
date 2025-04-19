const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: {
        type: [String, mongoose.Schema.Types.ObjectId],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    endAt : {
        type: Date,
        default: null,
    },
});