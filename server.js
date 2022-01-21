const express = require('express');
require('dotenv').config()
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT= require('./middleware/verifyJWT')
const credentials= require('./middleware/credentils')
const PORT = process.env.PORT || 8080;
const crypto=require('crypto');
const cookieParser = require('cookie-parser')
const connectDB=require('./config/configDB')
const mongoose = require('mongoose');
var token = crypto.randomBytes(64).toString('hex');
console.log(token);
// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

//connect db
connectDB();

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());
//use middleware
app.use(cookieParser())
//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));


app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open',()=>
   {
    console.log('Connected to MongoDB'),
    app.listen(PORT,process.argv[2] , () => console.log(`Server running on port ${PORT}`));
   }
);
//    console.log('Connected to MongoDB');
//    app.listen(PORT, () => console.log( Server running on port $(PORT} ));
//                  on.once( open
// })
