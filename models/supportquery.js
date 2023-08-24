const mongoose = require("mongoose")

const querySchema = new mongoose.Schema({
    qcase: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    archived:{
        type: Boolean,
        default: false,
    }
})


const Query = mongoose.model('Query', querySchema);

module.exports = Query