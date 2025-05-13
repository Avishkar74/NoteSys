const { logEvents } = require('./logger')

const errorHandler = (err,req,res,next) => {
    logEvents(`${err.name}: ${err.message}:\t${req.method}\t${req.url}\t${req.headers.origin}`,'errLog.log')
    console.error(err.stack)

    const status = res.statusCode ? res.statusCode : 500 // server error
    res.status(status)

    res.json({ error: err.message })
}

module.exports = errorHandler