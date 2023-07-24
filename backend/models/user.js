// Import the required modules
const mongoose = require('mongoose');

/*
 * Define the User model schema. 
 * A user has a unique email and a password. Both fields are required.
 */
const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
});

// Export the User model so it can be used in other parts of the application.
module.exports = User;
