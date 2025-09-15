const mongoose = require('mongoose')

const connectToDB = async()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to database successfully");
    }catch(e){
        console.error(e);
        process.exit(1)
    }
}

module.exports = connectToDB;