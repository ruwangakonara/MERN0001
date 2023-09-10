const User = require("../models/user")
const Comment = require("../models/comment");
const { compare } = require("bcryptjs");
const Post = require("../models/post")

const CreateComment =  async (reque, respo) => {
    
    try {

        const newComment = {
            text: reque.body.text,
            author: reque.user._id,
            authorname: reque.user.username,
            post: reque.post._id

        };

        const comment = await Comment.create(newComment);

        respo.status(201).json({ comment });
    } catch (error) {
        respo.status(500).json({ message: 'Internal server error' });
    }
}

const GetComments = async (request, response) => {

    try{

        const comments = await Comment.find({post: request.post._id})

        response.status(200).json({comments})

    }catch(errr){

        console.log(errr)
        res.status(500).json({ message: 'Server error' })

    }

}

const DeleteComment = async (request, response) => {

    try{

        const commentID = request.params.commentID
        
        const comment = await Comment.findById(commentID)

        if(!comment.author.equals(req.user._id) && request.user.role !== "admin") return response.status(403).json({message: "Forbidden"})

        await Comment.findOneAndDelete(comment)

        response.status(201).json({ message: "Comment Deleted" });

    } catch(errr){

        console.log(errr)
        response.status(500).json({ message: 'Server error' })

    }

}

const DeleteComments = async (req, res) => {
    try{
        const postID = req.params.postID

        const post = await Post.findById(postID)


        if(!post.author.equals(req.user._id) && req.user.role !== "admin") return res.status(403).json({message: "Forbidden"})

        await Comment.deleteMany({post: postID})
        res.status(201).json({ message: "Comments Deleted" });

    } catch(err){
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}

const UpdateComment = async(request, response) => {

    console.log("OOLLO")
    
    try{
        const commentID = request.params.commentID
        
        const comment = await Comment.findById(commentID)

        console.log(comment)
        console.log(request.user._id)

        if(!comment.author.equals(req.user._id) && request.user.role !== "admin") return response.status(403).json({message: "Forbidden"})

        const updatedAt = Date.now()
        const {text} = request.body

        console.log(text)

        await Comment.findByIdAndUpdate(commentID, {updatedAt, text})


        response.status(200).json({comment})

    } catch(errr){

        console.log(errr)
        res.status(500).json({ message: 'Server error' })

    }
    

}

module.exports = {

    CreateComment,
    UpdateComment,
    DeleteComment,
    GetComments,
    DeleteComments

}