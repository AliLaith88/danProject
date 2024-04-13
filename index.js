var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const initialize = require('./passportConfig');
const mongoose = require('mongoose');
require('dotenv').config();

var indexRouter = require('./routes/router');

var app = express();

// Middleware for parsing JSON and url-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

initialize(passport);



const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
});

module.exports = app;
