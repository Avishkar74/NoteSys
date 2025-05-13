const { callback } = require('chart.js/helpers')
const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin,callback) =>{
        if(allowedOrigins.indexOf(origin) !== -1 || !origin ){ // -1 means not found
            callback(null,true) // origin is allowed
        }else{
            callback(new Error('Not allowed by cors')) // origin is not allowed
        }
        
    },
    credentials: true, // access control allow credentials
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

module.exports = corsOptions