/*
 * Import the express library. Express is a minimal and flexible Node.js web 
 * application framework that provides a robust set of features for web and mobile applications.
 */
const express = require("express");

/*
 * Import the body-parser library. Body-parser is a middleware that is 
 * responsible for parsing the incoming request bodies in a middleware before your handlers.
 */
const bodyParser = require("body-parser");

// Create a new router object.
const headers = new express.Router();

// Configure the router to use body-parser as middleware.
headers.use(bodyParser.json());
headers.use(bodyParser.urlencoded({ extended: false }));

/*
 * This middleware function is used to set the Access-Control headers for all incoming requests.
 * It allows all origins, several headers, and several HTTP methods.
 * After setting the headers, it calls the next middleware function.
 */
headers.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH,PUT, DELETE, OPTIONS"
    );
    next();
});

// Export the router object so it can be used in other parts of the application.
module.exports = headers;
