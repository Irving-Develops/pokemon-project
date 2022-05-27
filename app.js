//======== External Modules =================
const express = require('express');
const app = express();
const morgan = require('morgan');

//======== Internal Modules ==================
const routes = require('./routes/home.js');



app.set('view engine', 'pug')

app.use(morgan('dev'));

//======== Routes ===========================
app.use(routes)

//======== Middleware =======================
//catch unhandled requests
app.use((req, res, next) => {
    const err = new Error('The requested page could not be found');
    err.status = 404;
    next(err)
})

// Custom error handlers.

// Error handler to log errors.
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        // TODO Log the error to the database.
    } else {
        console.error(err);
    }
    next(err);
});

// Error handler for 404 errors.
app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404);
        res.render('page-not-found', {
            title: 'Page Not Found',
        });
    } else {
        next(err);
    }
});

// Generic error handler.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = process.env.NODE_ENV === 'production';
    res.render('error', {
        title: 'Server Error',
        message: isProduction ? null : err.message,
        stack: isProduction ? null : err.stack,
    });
});









module.exports = app;