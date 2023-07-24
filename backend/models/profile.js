// Import required modules
const mongoose = require('mongoose');

/*
 * Define the Profile model schema. 
 * A profile has a unique username, a bio, an image path, and a reference to the User
 * model who is the creator of the profile.
 * All fields are required.
 */
const Profile = mongoose.model('Profile', {
    username: {
        type: String,
        required: true,
        unique: true
    },

    bio: {
        type: String,
        required: true
    },
    imagePath: { 
        type: String,
         required: true 
        },

    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

// Export the Profile model so it can be used in other parts of the application.
module.exports = Profile;
