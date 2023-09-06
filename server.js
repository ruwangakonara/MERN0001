const express = require("express")
const connenctMongo = require("./config/mangoconnect")
const bodyParser = require("body-parser")
const path = require("path")
const cookieParse = require("cookie-parser")


const AnnouncementController = require("./controllers/announcementsController")
const PostController = require("./controllers/postsController")
const UserController = require("./controllers/usersController")
const QueryController = require("./controllers/queryController")
const CommentController = require("./controllers/commentsController")

const requireAuth = require("./middleware/requireAuth")
const isAdmin = require("./middleware/isAdmin")
const validatePost = require("./middleware/postValidate")

const cors = require("cors")


const app = express()

app.use(express.json())
app.use(cookieParse())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(cors(
    {
        origin: true,
        credentials: true
    }
))
app.use('/uploadedpostimgs', express.static(path.join(__dirname, 'uploadedpostimgs')));
// app.use(session({
//     secret: 'dasecretkey',
//     resave: false,
//     saveUninitialized: true
// }));

connenctMongo()

if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}



// Registration Login

app.post("/signup", UserController.SignUp)
app.post("/signin", UserController.SignIn)
app.get("/signout", UserController.SignOut)
app.get("/check-auth", UserController.checkAuth)


// app.post("/signin", async (request, response) => {
    
//     const {username, password} = request.body
//     try{
//         const user = await User.Find({
//             username,
//             password
//         })

//         const token = jwt.sign({ username: user.username }, 'your-jwt-secret');
//         response.cookie('token', token);

//         response.status(200).redirect("/")
    
//     } catch(err){
//         response.status(500).send("Server Error, Unable to Sing in" + err)
//     }
    
// })



//Notes

app.get("/announcements", AnnouncementController.FetchAnnouncements)

app.get("/announcements/:id", AnnouncementController.FetchAnnouncement)

app.put("/announcements/:id",requireAuth, isAdmin, AnnouncementController.UpdateAnnouncement)

app.post("/announcements",requireAuth, isAdmin, AnnouncementController.CreateAnnouncement)

app.delete("/announcements/:id",requireAuth, isAdmin, AnnouncementController.DeleteAnnouncement)

app.listen(process.env.PORT)


//Images



app.get('/posts', PostController.FetchPosts);

app.get("/posts/:postID", validatePost, PostController.FetchPost)

app.post('/posts/upload',requireAuth, PostController.uploader.single('image'), PostController.UploadPost);

app.delete('/posts/:postID',requireAuth, isAdmin, PostController.DeletePost);




app.post("/comments/:postID", requireAuth, validatePost, CommentController.CreateComment)

app.get("/comments/:postID", requireAuth, validatePost, CommentController.GetComments)

app.delete("/comments/:commentID", requireAuth, CommentController.DeleteComment)

app.put("/comments/:commentID", requireAuth, CommentController.UpdateComment)


//

app.get("/queries", requireAuth, isAdmin, QueryController.FetchQueries)

app.get("/queries/:id", requireAuth, isAdmin, QueryController.FetchQuery)

app.post("/queries", QueryController.CreateQuery)

app.put("/queries/:id", requireAuth, isAdmin, QueryController.ArchiveQuery)

app.delete("/queries/:id", requireAuth, isAdmin, QueryController.DeleteQuery)