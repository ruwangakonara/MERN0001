const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    username:{
        type: String,
        required:true,
        unique: true
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User