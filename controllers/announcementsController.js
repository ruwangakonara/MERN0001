const Announcement = require("../models/announcement")

const FetchAnnouncements = async (request, response) => {

    try{
        const announcements = await Announcement.find()

        response.status(200).json({announcements})
    } catch(err){

        console.log(err)
        response.sendStatus(500)

    }

    // response.json(announcements)

}

const FetchAnnouncement = async(request, response) => {

    try{
        const id = request.params.id
        const announcement = await Announcement.findById(id)

        response.status(200).json({announcement})

    } catch(err){

        console.log(err)
        response.sendStatus(500)

    }

}

const UpdateAnnouncement =  async (request, response) => {

    try{

        const id = request.params.id
        const {body, title} = request.body

        // const announcement = await Announcement.findById(id)

        // announcement.body = body
        // announcement.title = title

        // announcement.save()
    
        await Announcement.findByIdAndUpdate(id, {
            title,
            body
        })
    
        const announcement = await Announcement.findById(id)
    
        response.json({announcement})

    } catch(err){

        console.log(err)
        response.sendStatus(500)

    }

}

const CreateAnnouncement = async (request, response) => {

    try{

        const {body, title} = request.body

        const announcement = await Announcement.create({
            title,
            body
        })
    
        response.status(200).json({announcement})

    } catch(err) {

        console.log(err)
        response.sendStatus(500)

    }

}

const DeleteAnnouncement = async (req, res) => {

    try{

        const id = req.params.id

        await Announcement.deleteOne({_id: id})
    
        res.json({success: `${id} got deleted`})

    } catch(err){

        console.log(err)
        response.sendStatus(500)

    }
    
    
}


module.exports = {
    FetchAnnouncements,
    FetchAnnouncement,
    UpdateAnnouncement,
    DeleteAnnouncement,
    CreateAnnouncement
}