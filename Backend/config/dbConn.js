const mongoose = require('mongoose')

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.DATABASE_URI)
        console.log('MongoDB Connected')
    }
    catch(error){
        console.log(error)
        
    }
}

module.exports = connectDB