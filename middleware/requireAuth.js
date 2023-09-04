const jwt = require("jsonwebtoken")
const User = require("../models/user")

async function requireAuth(requ, resp, next){

    try{
        const token = requ.cookies.Authentication

        if(token === undefined) return resp.status(203).json()

        const decoded = jwt.verify(token, process.env.DASECRET)

        if(Date.now() > decoded.exp) resp.sendStatus(401)

        try{
            const user = await User.findById(decoded.sub)
            
            if (!user) {
                return resp.sendStatus(401);
            }

            requ.user = user;
            next();
        }
        catch(err){
            console.log(err.message)
            return resp.sendStatus(401)
        }
    } catch(err){

        console.log(err.message)

        resp.sendStatus(401)

    }
   
}

module.exports = requireAuth;
