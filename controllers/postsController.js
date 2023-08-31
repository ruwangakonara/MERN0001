const multer = require("multer")
const path = require("path")
const fs = require("fs")

const Post = require("../models/post")

const store = multer.diskStorage({
    destination: 'uploadedpostimgs/',
    filename: function (req, file, cb) {
      cb(null, file.originalname + Date.now());
    },
});

const uploader = multer({ storage: store });

const FetchPosts = async (request, response) => {

    try{
        const posts = await Post.find();
        response.status(200).json({posts});

    }catch(err){

        console.log(err)
        response.status(500).json({message: "Unable to load Posts"})

    }


}


const FetchPost = async (request, response) => {

    try{
        const post = await Post.findById(req.params.id);
        response.status(200).json({post});

    }catch(err){

        console.log(err)
        response.status(500).json({message: "Unable to load Posts"})

    }


}

const UploadPost = async (request, response) => {

  
    try{
        const { filename } = request.file;
        const { coursename, unitname, description} = request.body
        const post = new Post({ filename, coursename, unitname, description });
        await post.save();
        response.status(200).json({ message: `Post with image ${post.filename} uploaded successfully` });
    }catch(err){
        console.log(err)
        response.status(500).json({message: "Unable to upload Posts"})
        
    }
}

const DeletePost = async (reque, resp) => {
    
    const id = reque.params.id;

    const post = await Post.findById(id)

    const filepath = path.join(__dirname, "../uploadedpostimgs", post.filename)
    fs.unlinkSync(filepath)


    await Post.findByIdAndDelete(id);
    resp.json({ message: 'Post deleted successfully' });
    
}

const CreateComment =  async (reque, respo) => {
    
    try {
        const newComment = {
            text: reque.body.text,
            author: reque.user._id // Assuming you have user authentication
        };

        reque.post.comments.push(newComment);
        await reque.post.save();

        respo.status(201).json({ comment: newComment });
    } catch (error) {
        respo.status(500).json({ message: 'Internal server error' });
    }
}

const GetComments = async (request, response) => {

    try{

        const comments = request.post.comments

        response.status(200).json({comments})

    }catch(errr){

        console.log(errr)
        res.status(500).json({ message: 'Server error' })

    }

}

const DeleteComment = async (request, response) => {

    try{

        const commentID = request.params.commentID
        
        const commentindx = request.post.comments.findIndex(comm => comm._id.toString() === commentID)

        if (commentindx === -1) return response.status(404).json({message: "Not Found"})

        if(request.post.comments[commentindx].author !== request.user._id && request.user._id !== "admin") return response.status(403).json({message: "Forbidden"})

        request.post.comments.splice(commentindx, 1);
        await request.post.save();

        response.status(201).json({ message: "Comment Deleted" });

    } catch(errr){

        console.log(errr)
        res.status(500).json({ message: 'Server error' })

    }

}

const UpdateComment = async(request, response) => {

    
    try{
        const commentID = request.params.commentID
            
        const commentindx = request.post.comments.findIndex(comm => comm._id.toString() === commentID)

        if (commentindx === -1) return response.status(404).json({message: "Not Found"})

        if(request.post.comments[commentindx].author !== request.user._id) return response.status(403).json({message: "Forbidden"})

        request.post.comments[commentindx].text = request.body.text
        request.post.comments[commentindx].updatedAt = Date.now()

        const comment = request.post.comments[commentindx]

        request.post.save()

        response.status(200).json({comment})

    } catch(err){

        console.log(errr)
        res.status(500).json({ message: 'Server error' })

    }
    

}

module.exports = {

    DeletePost,
    FetchPosts,
    UploadPost,
    uploader,
    CreateComment,
    GetComments,
    DeleteComment,
    UpdateComment,
    FetchPost

}