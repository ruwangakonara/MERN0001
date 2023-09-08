const multer = require("multer")
const path = require("path")
const fs = require("fs")

const Post = require("../models/post")

const store = multer.diskStorage({
    destination: 'uploadedpostimgs/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
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
        const post = await Post.findById(request.params.postID);
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
        const author = request.user._id
        const authorname = request.user.username
        const post = new Post({ filename, coursename, unitname, description, authorname, author });
        await post.save();
        response.status(200).json({ message: `Post with image ${post.filename} uploaded successfully`, postid:post._id});
    }catch(err){
        console.log(err)
        response.status(500).json({message: "Unable to upload Posts"})
        
    }
}

const UpdatePost = async (request, response) => {
    try{

        console.log(request.body)
        const { filename } = request.file;
        const { coursename, unitname, description} = request.body

        const filepath = path.join(__dirname, "../uploadedpostimgs", request.post.filename)
        fs.unlinkSync(filepath)
    

        await Post.findByIdAndUpdate(request.post._id, {
            filename,
            coursename,
            description,
            unitname
        })

        response.status(200).json({ message: `Post with image ${request.post.filename} uploaded successfully`, postid:request.post._id});

    } catch(err){
        console.log(err)
        response.status(500).json({message: "Unable to update Posts"})
        
    }
}

const DeletePost = async (reque, resp) => {
    
    const id = reque.params.postID;

    const post = await Post.findById(id)

    const filepath = path.join(__dirname, "../uploadedpostimgs", post.filename)
    fs.unlinkSync(filepath)

    try{
        await Post.findByIdAndDelete(id);
        resp.status(200).json({ message: 'Post deleted successfully' });    
    }catch(err){
        console.log(err)
        resp.status(500).json({ message: "Could not delete" });    

    }
    
}



module.exports = {

    DeletePost,
    FetchPosts,
    UploadPost,
    uploader,
    FetchPost,
    UpdatePost

}