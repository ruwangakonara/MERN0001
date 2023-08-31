const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({

    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

});

const postSchema = new mongoose.Schema({
    filename: {type: String, required: true},
    coursename: {type: String, required: true},
    unitname: {type: String, required: true },
    description: {type: String, required: true},
    createdAt: {type: Date, default: Date.now },
    comments: [commentSchema]
})


const Post = mongoose.model('Post', postSchema);

module.exports = Post