const Query = require("../models/supportquery")


const FetchQueries = async (request, response) => {

    try{
        const queries = await Query.find()
        response.status(200).json({queries})

    } catch(err) {
        console.log(err)
        response.sendStatus(500)

    }

    // response.json(announcements)

}


const ArchiveQuery =  async (request, response) => {

    try{

        const id = request.params.id
        const {body, qcase, name, email} = request.body
    
        await Query.findByIdAndUpdate(id, {
            qcase,
            body, 
            name,
            email,
            archived: true
        })
    
        const query = await Query.findById(id)
    
    
        response.status(200).json({query})

    } catch(err){

        console.log(err)
        response.sendStatus(500)

    }


}

const CreateQuery = async (request, response) => {

    try{
        const {qcase, body, name, email} = request.body


        const query = await Query.create({
            qcase,
            body,
            name,
            email
        })
    
        response.status(200).json({query})
    } catch(err){

        console.log(err)
        response.sendStatus(500)

    }
    
}

const DeleteQuery = async (req, res) => {

    try{
        const id = req.params.id

        await Query.deleteOne({_id: id})
    
        res.status(200).json({success: `Query ${id} got deleted`})

    } catch(err){

        console.log(err)
        response.sendStatus(500)

    }
    
}


module.exports = {
    FetchQueries,
    ArchiveQuery,
    DeleteQuery,
    CreateQuery
}