// Import required modules
const express = require('express')
const User = require('../models/user')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Import the JWT secret key from the environment variables
const jwtSecret = process.env.JWT_SECRET;

// Create a new router instance
const router = express.Router();

/**
 * This route handles user signup.
 * It first hashes the password using bcrypt, then creates a new user with the hashed password.
 * If a user with the same email already exists, it sends a 401 response.
 * If the user is successfully created, it sends a 201 response with the created user.
 */
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });

    User.findOne({email:req.body.email}).then(user1=>{
      if(user1){
        return res.status(401).json({
          message: "User Already Exist"
        });
      }

      user.save().then(result => {
        if(!result){
          return res.status(500).json({
            message: "Error Creating User"
          });
        };

        res.status(201).json({
          message: "User created!",
          result: result
        });
      });
    })   
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  });   
});

/**
 * This route handles user login.
 * It first checks if a user with the provided email exists.
 * If the user does not exist or the password does not match, it sends a 401 response.
 * If the login is successful, it creates a JWT token and sends a 200 response with the token and user ID.
 */
router.post("/login", (req, res, next) => {
  let fetchedUser;

  User.findOne({email:req.body.email}).then(user=>{
    if(!user){
      return res.status(401).json({
        message: "Sorry, we couldn't login. Please try again or reset your password."
      })
    }
    fetchedUser=user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result=>{
    if(!result){
      return res.status(401).json({
        message: "Sorry, we couldn't login. Please try again or reset your password."
      })
    }
    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      jwtSecret,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  })
  .catch(e=>{
    console.log(e)
  });
});

// Export the router
module.exports = router