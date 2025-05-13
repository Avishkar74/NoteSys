const { format } = require('date-fns') // date formatting
const {v4:  uuid } = require('uuid') // universal unique identifier
const fs = require('fs') // file system
const fsPromises  = require('fs').promises // file system promises
const path = require('path') // path


// log events
const logEvents = async (message, logFileName) => { 
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}` // date and time
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`         // log item
    
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){  // if logs folder doesn't exist    , but here we might not need it cause logs folder will always exist unless we delete it  .  but got to learn something here 
            await fsPromises.mkdir(path.join(__dirname,'..' , 'logs')) // create logs folder
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs', logFileName), logItem) // append log item
    } catch(error){
        console.log(error)
    }
}

//custom middleware
const logger = (req,res,next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log') // log events  , this will log all the requests , coming from on our own url too . we might need to add some conditions later
    console.log(`${req.method} ${req.path}`) // log to console
    next() // next middleware
}

module.exports = { logger , logEvents }


