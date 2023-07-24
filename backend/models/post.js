// Import required modules
const mongoose = require('mongoose');

/*
 * Define the Post model. A model is a class with which we construct documents. 
 * In this case, each document will be a post 
 * with properties and behaviors as declared in our schema.
 */
const Post = mongoose.model('Post', {
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    imagePath: { 
        type: String,
        required: true 
    },
    
    postDate: {
        type: String,
        required: true
    },

    /*
     * `creator` is a required field of type ObjectId. It represents the user who created the post.
     * The `ref` option is what tells Mongoose which model to use during population, in this case, "User".
     */
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }
});

// Export the Post model so it can be used in other parts of the application.
module.exports = Post;
