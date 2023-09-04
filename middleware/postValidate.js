const Post = require("../models/post")

const validatePost = async (req, res, next) => {
    try {

        const post = await Post.findById(req.params.postID);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        req.post = post; 
        next();
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = validatePost