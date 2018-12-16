const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('./config/database'); //database configuration
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const publicRouter = require('./routes/routes');

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
    res.json({ "tutorial": "Build REST API with node.js" });
});

// public route
app.use('/c2tapi', publicRouter);

// // private route
// app.use('/', validateUser, route);

app.use('/', indexRouter);
app.use('/home', usersRouter);
app.use('/c2tapi', usersRouter);


app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204);
});

function validateUser(req, res, next) {
    if (!req.headers['x-access-token']) {
        res.send({
            "status": "Authorization token must be supplied."
        });
        // return next('Authorization token must be supplied.')
    } else {
        var query = {};
        if (req.headers['x-access-token']) {
            query.token = req.headers['x-access-token'];
        };
        userModel.find(query, function (err, userInfo) {
            var result = {};
            if (err) {
                res.send({
                    "status": err.message
                });
                return;
            }
            if (!userInfo || !userInfo.length > 0) {
                res.send({
                    "status": "Invalid Token. User not found"
                });
                return;
            }
            req.body.userId = userInfo.id;
            next();
        });
    }
}

// express doesn't consider not found 404 as an error so we need to handle 404 it explicitly
// handle 404 error
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function (err, req, res, next) {
    console.log(err);

    if (err.status === 404)
        res.status(404).json({ message: "Not found" });
    else
        res.status(500).json({ message: "500 internal server error" });

});

module.exports = app; 
