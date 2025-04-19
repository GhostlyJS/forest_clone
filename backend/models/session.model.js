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
    tree : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tree',
    },
    status: {
        type: String,
        enum: ['not-started', 'started', 'done'],
        default: 'not-started',
    },
});

module.exports = mongoose.model('Session', sessionSchema);