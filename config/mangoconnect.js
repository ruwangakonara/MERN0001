if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}

const mongoose = require("mongoose")

async function connenctMongo(){
    try{
        await mongoose.connect(process.env.MANGO_URL2)
        console.log("Connected to MANGO!")
    } catch(err) {
        console.log(err)
    }

}

module.exports = connenctMongo