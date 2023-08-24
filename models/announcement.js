const mongoose = require("mongoose")

const announcementSchema = new mongoose.Schema({
    title: String,
    body: String
});

const Announcement = mongoose.model('Announcement', announcementSchema);


module.exports = Announcement