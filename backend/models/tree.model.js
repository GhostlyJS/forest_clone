const mongoose = require('mongoose');

const treeSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    imageUrl : {
        type: String,
        required: true,
    },
})