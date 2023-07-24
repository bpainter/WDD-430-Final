// Import required modules
const express = require('express');
const path = require('path');
const multer = require("multer");

// Import other required files
const Post = require('../models/post');
const checkAuth = require("../middleware/checkauth");

/**
 * Define a map of valid MIME types for image files. This is used to validate the files being uploaded.
 * This is necessary because we want to ensure that only valid image files are uploaded.
 */
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif"
};

/**
 * Function to sanitize filenames by removing non-alphanumeric characters. 
 * This is to ensure that the filenames are safe to use.
 * This is important because filenames can contain malicious code or cause errors 
 * if they contain certain characters.
 */
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-z0-9 ]/gi, '');
};

/**
 * Define storage for multer to store uploaded files. This is a middleware used for handling
 * multipart/form-data, which is primarily used for uploading files.
 * The destination function validates the file type and sets the destination path.
 * The filename function sanitizes the filename and appends a timestamp to make it unique.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");

        if (isValid) {
            error = null;
        }

        cb(error, path.join(__dirname, '../images'));
    },

    filename: (req, file, cb) => {
        const name = sanitizeFilename(file.originalname)
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];

        cb(null, name + "-" + Date.now() + "." + ext);
    }
});

// Create a new router object
const router = new express.Router();

/**
 * Route for creating a new post. It uses the checkAuth middleware to protect the route, 
 * and multer to handle the image upload.
 * 
 * The handler function constructs the URL for the image, creates a new Post object, and 
 * saves the post to the database.
 * 
 * If the post was saved successfully, it returns a success response. 
 * If not, it returns an error response.
 * 
 * Files are stored in the /backend/images folder.
 */
router.post("", checkAuth, multer({ storage: storage }).single("image"),
    (req, res, next) => {
        const url = req.protocol + "://" + req.get("host");
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename,
            creator: req.userData.userId,
            postDate: req.body.postDate,
        });

        post.save().
        then(post => {
            if(post){
                res.status(201).json({
                    message: "The post was added successfully!",
                    post: {
                        ...post,
                        id: post._id
                    }
                });
            }
            else{
                res.status(500).json({ message: "The post failed due to an error" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'The post failed due to an error: ' + error }); 
        });
});

/**
 * Route for updating an existing post. It uses the checkAuth middleware to protect the route, 
 * and multer to handle the image upload.
 * 
 * The handler function constructs the URL for the image (if a new image was uploaded), 
 * creates a new Post object, and updates the post in the database.
 * If the post was updated successfully, it returns a success response. 
 * If not, it returns an error response.
 * 
 * Files are stored in the /backend/images folder.
 */
router.put("/:id", checkAuth, multer({ storage: storage }).single("image"),
    (req, res, next) => {
        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + "/images/" + req.file.filename
        }

        const post = new Post({
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath,
            creator: req.userData.userId
        });

        Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
            .then(result => {
                if(result){
                    res.status(200).json({ message: "The post updated successfully." });
                }  
                else {
                    res.status(500).json({ message: "The post could'nt be updated due to an error" });
                }
            }).catch(error => {
                res.status(500).json({ message: 'The update failed due to an error: ' + error });  
            });
});

/**
 * Route for fetching all posts of the logged in user. It uses the checkAuth middleware 
 * to protect the route.
 * 
 * The handler function fetches the posts from the database and returns them in the response.
 * If no posts were found, it returns an error response.
 */
router.get("/myposts", checkAuth, (req, res, next) => {
    Post.find({creator: req.userData.userId})
        .then(post => {
            if (post) {
                res.status(200).json({
                    message: "My posts were loaded successfully.",
                    posts: post
                });
            } 
            else {
                res.status(404).json({ message: "Myposts couldn't be loaded." });
            }})
        .catch(error => {
            res.status(500).json({ message: 'The post listings failed due to an error: ' + error }); 
        });
});

/**
 * Route for fetching all posts. It does not use any middleware.
 * 
 * The handler function fetches the posts from the database and returns them in the response.
 * If no posts were found, it returns an error response.
 */
router.get("", (req, res, next) => {
    Post.find()
        .then(documents => {
            if(documents){
                res.status(200).json({
                    message: "All posts were loaded successfully",
                    posts: documents
                });
            }
            else {
                res.status(404).json({ message: "All posts could't be loaded." });
            }})
        .catch(error => {
            res.status(500).json({ message: 'The post listings failed due to an error: ' + error });  
        });
});

/**
 * Route for fetching a single post by id. It does not use any middleware.
 * 
 * The handler function fetches the post from the database and returns it in the response.
 * If the post was not found, it returns an error response.
 */
router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } 
      else {
        res.status(404).json({ message: "No post could be found." });
      }
    });
});

/**
 * Route for deleting a post by id. It uses the checkAuth middleware to protect the route.
 * 
 * The handler function deletes the post from the database and returns a success response.
 * If the post was not found or the user is not authorized to delete the post, 
 * it returns an error response.
 */
router.delete("/:id", checkAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
      result => {
        if (result.n > 0) {
          res.status(200).json({ message: "The post was deleted successfully." });
        } 
        else {
            return res.status(401).json({ message: "The post couldn't be deleted due to authorization." });
        }
      }
    );
});

// Export the router so it can be used in other parts of the application.
module.exports = router;