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

const FetchQuery = async (request, response) => {

    try{
        const queryID = request.params.id
        const query = await Query.findById(queryID)
        response.status(200).json({query})

    } catch(err) {
        console.log(err)
        response.sendStatus(500)

    }

    // response.json(announcements)

}

const ArchiveQuery =  async (request, response) => {

    try{

        const id = request.params.id
        const {body, qcase, name, email, archived} = request.body
    
        await Query.findByIdAndUpdate(id, {
            qcase,
            body, 
            name,
            email,
            archived
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

        if (request.user !== undefined){
            const author = request.user._id
            const authorname = request.user.username

            const query = await Query.create({
                qcase,
                body,
                name,
                email,
                author,
                authorname
            })
            response.status(200).json({query})

        } else {
            const query = await Query.create({
                qcase,
                body,
                name,
                email,
                author: null,
                authorname: ""
            })
            response.status(200).json({query})

        }
      
    
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
    CreateQuery,
    FetchQuery
}