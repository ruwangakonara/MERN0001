const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');



const SignUp = async (request, response) => {

    try{
        const {email, password, username} = request.body

        const hashedPass = bcrypt.hashSync(password, 9)
        const user = await User.create({
            email,
            password: hashedPass,
            username
        })

        // const token = jwt.sign({ username: user.username }, 'your-jwt-secret');
        // response.cookie('token', token);

        const exp = Date.now() + 1000*60*60*2
        const token = jwt.sign({sub: user._id, exp}, process.env.DASECRET)
    
        response.cookie("Authentication", token, {
            expires: new Date(exp),
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        })
        response.sendStatus(200)

        // response.sendStatus(200)/*redirect("/")*/

    
    } catch(err){
        console.log(err)
        response.status(400).send(" Unable to Sign Up")
    }
}

const SignIn = async (request, response) => {

    try{

        const email = request.body.email
        const password = request.body.password.toString()
    
        if(!email || !password) return response.sendStatus(401)
    
        const user = await User.findOne({email})
    
        if (!user) return response.sendStatus(401)
    
    
        const passmatch = bcrypt.compareSync(password, user.password)
        if(!passmatch) return response.sendStatus(401)
    
        var exp;

        if (user.role === "user") {exp = Date.now() + 1000*60*60*2}
        else {exp = Date.now() + 1000*60*30}
        
        const token = jwt.sign({sub: user._id, exp}, process.env.DASECRET)
    
        response.cookie("Authentication", token, {
            expires: new Date(exp),
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        })
        response.sendStatus(200)

    } catch(err){

        console.log(err)
        response.sendStatus(400)

    }
 
}

// function checkAuth(request, response) {
    
//     try{

//         console.log(request.user)
//         response.status(200).send()

//     } catch(err){

//         console.log(err)
//         response.status(400).send()

//     }

// }

async function checkAuth(request, response) {

    try{
        const token = request.cookies.Authentication

        if(!token) return response.sendStatus(401)

        const decoded = jwt.verify(token, process.env.DASECRET)

        if(Date.now() > decoded.exp) return response.sendStatus(401)

        try{
            const user = await User.findById(decoded.sub)
            
            if (!user) {
                return response.sendStatus(401);
            }
        }
        catch(err){
            console.log(err.message)
            return response.sendStatus(401)
        }
    } catch(err){

        console.log(err.message)

        response.sendStatus(401)

    }

}


function SignOut(request, response) {

    try{

        response.clearCookie("Authentication")
        response.sendStatus(200)

    } catch(err){

        console.log(err)
        response.sendStatus(400)

    }

}

module.exports = {

    SignIn,
    SignOut,
    SignUp,
    checkAuth

}