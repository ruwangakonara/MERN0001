const jwt = require("jsonwebtoken")
const User = require("../models/user")

async function authQuery(requ, resp, next){

    try{
        const token = requ.cookies.Authentication

        if(token === undefined) {
           return next()
        }

        const decoded = jwt.verify(token, process.env.DASECRET)

        if(Date.now() > decoded.exp) {
           return next()
        }

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

module.exports = authQuery;
