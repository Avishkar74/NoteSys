const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const PORT = process.env.PORT || 3000 
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')


app.use(cors(corsOptions))

app.use(logger) // custom middleware , this will log every request
     //built-in middlewares
app.use(express.json())  // for parsing application/json
app.use(cookieParser()) // for parsing cookies  , third party middleware
app.use('/',express.static(path.join(__dirname, 'public'))) // for serving static files

app.use('/' , require('./routes/root')) // root route


app.use((err, req, res, next) => {  // error handler
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use( (req, res) => {   // custom 404
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler) // custom error handler middleware

app.listen(PORT,() => { console.log(`Server is running on port ${PORT}`)})