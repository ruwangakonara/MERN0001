const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    filename: {type: String, required: true},
    coursename: {type: String, required: true},
    unitname: {type: String, required: true },
    description: {type: String, required: true},
    createdAt: {type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorname: {type: String, required: true}

})


const Post = mongoose.model('Post', postSchema);

module.exports = Post