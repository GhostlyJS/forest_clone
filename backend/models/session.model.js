const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    startedAt: {
        type: Date,
        default: null,
    },
    endAt : {
        type: Date,
        default: null,
    },
    tree : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tree',
    },
    status: {
        type: String,
        enum: ['not-started', 'started', 'done'],
        default: 'not-started',
    },
    time: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Session', sessionSchema);