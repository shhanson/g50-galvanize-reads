'use strict';

//const bodyParser = require('body-parser');
//const dotenv = require('dotenv');
const express = require('express');
const path = require('path');

//Routes setup
const booksRouter = require('./routes/books');
// const authorsRouter = require('./routes/authors');

const app = express();
const port = process.env.PORT || 8000;

//dotenv.load();

//Setup for templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.disable('x-powered-by');

//Use routes
app.use(booksRouter);
// app.use(authorsRouter);

//Error handling for 404
app.use((_req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error handling for 500
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    res.render('pages/error', {
        message: err.message,
        error: err
    });
});

app.listen(port, () =>{
    console.log("Listening on port", port);
});
