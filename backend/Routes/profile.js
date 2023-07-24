// Import required modules
const express = require('express')
const path = require('path');
const multer = require("multer");

// Import other required files
const checkAuth = require("../middleware/checkauth");
const Profile = require('../models/profile');
const Post = require('../models/post');

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
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});

// Create a new router object
const router = express.Router();

/**
 * Route for creating a new profile. It first checks if the user is authenticated.
 * Then it uploads the image using multer and the storage configuration defined above.
 * It then creates a new profile with the provided data and saves it to the database.
 * If a profile already exists for the user, it sends a 401 response.
 * If the profile is successfully created, it sends a 201 response with the profile data.
 * If there's an error, it logs the error and sends a 500 response.
 */
router.post("/create", checkAuth, multer({ storage: storage }).single("image"),
    (req, res, next) => {
        const url = req.protocol + "://" + req.get("host")
        const profile = new Profile({
            username: req.body.username,
            bio: req.body.bio,
            imagePath: url + "/images/" + req.file.filename,
            creator: req.userData.userId
        });

        Profile.findOne({ creator: req.userData.userId }).then(user1 => {
            if (user1) {
                return res.status(401).json({
                    message: "Profile Already Exist"
                })
            }
            return profile.save()

        }).then(prof => {
            if (!prof) {
                return res.status(500).json({
                    message: "Error Creating Profile"
                })
            }
            res.status(201).json({
                message: "Profile created!",
                profile: prof
            });
        })
        .catch(e => {
            console.log("error is", e);
        });
});

/**
 * Route for editing a profile. It first checks if the user is authenticated.
 * Then it uploads the new image using multer and the storage configuration defined above.
 * It then updates the profile with the provided data and saves it to the database.
 * If the profile is successfully updated, it sends a 200 response.
 * If there's an error, it logs the error and sends a 500 response.
 */
router.put("/edit/:id", checkAuth, multer({ storage: storage }).single("image"),
    (req, res, next) => {
        let imagePath = req.body.imagePath;
        const url = req.protocol + "://" + req.get("host")
        if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + "/images/" + req.file.filename
        }

        const profile = new Profile({
            _id: req.body.id,
            username: req.body.username,
            bio: req.body.bio,
            imagePath: imagePath,
            creator: req.userData.userId
        })

        Profile.updateOne({ _id: req.params.id, creator: req.userData.userId }, profile)
        .then(result => {
            if (result) {
                res.status(200).json({ message: "Update successful!" });
            }

            else {
                res.status(500).json({ message: "Error Upating Profile" });
            }
        })
        .catch(e => {
            res.status(500).json({ message: "Error Upating Profile ,Username taken" });
            console.log(e)
        });
    }
);

/**
 * Route for editing a profile. It first checks if the user is authenticated.
 * Then it uploads the new image using multer and the storage configuration defined above.
 * It then updates the profile with the provided data and saves it to the database.
 * If the profile is successfully updated, it sends a 200 response.
 * If there's an error, it logs the error and sends a 500 response.
 */
router.get("/profiles",
    (req, res, next) => {
        Profile.find().then(prof => {
            if (prof) {
                res.status(200).json({
                    message: "Profile fetched successfully!",
                    profile: prof
                });
            } else {
                res.status(404).json({ message: "Profile not found!" });
            }
        })
        .catch(e => {
            console.log(e)
        });
});


/**
 * Route for fetching a profile by the authenticated user's id. 
 * It first checks if the user is authenticated.
 * Then it queries the database for a profile with the authenticated user's id.
 * If a profile is found, it sends a 200 response with the profile data.
 * If no profile is found, it sends a 404 response.
 */
router.get("/viewprofile", checkAuth,
    (req, res, next) => {
        Profile.findOne({ creator: req.userData.userId }).then(prof => {
            if (prof) {
                res.status(200).json({
                    message: "Profile fetched successfully!",
                    profile: prof
                });
            } else {
                res.status(404).json({ message: "Profile not found!" });
            }
        });
});

/**
 * Route for fetching a profile by a specific creator id. 
 * It queries the database for a profile with the provided creator id.
 * If a profile is found, it sends a 200 response with the profile data.
 * If no profile is found, it sends a 404 response.
 */
router.get("/bycreator/:id",
    (req, res, next) => {
        Profile.findOne({ creator: req.params.id }).then(prof => {
            if (prof) {
                res.status(200).json({
                    message: "Profile fetched successfully!",
                    profile: prof
                });
            } else {
                res.status(404).json({ message: "Profile not found!" });
            }
        });
});

/**
 * Route for fetching a profile by a specific creator id. 
 * It queries the database for a profile with the provided creator id.
 * If a profile is found, it sends a 200 response with the profile data.
 * If no profile is found, it sends a 404 response.
 */
router.get("/:id/mypost",
    (req, res, next) => {
        let user
        let creatorId
        Profile.findOne({ username: req.params.id }).then(prof => {
            if (prof) {
                user = prof
                return Post.find({ creator: user.creator })
            }
        }).then(post => {
            res.status(200).json({
                message: "Post fetched successfully!",
                post: post
            });
        })
        .catch(e => {
            console.log(e)
            res.status(404).json({ message: "error Fetching Post!" });
        });
});

/**
 * Route for fetching a profile by a specific username. 
 * It queries the database for a profile with the provided username.
 * If a profile is found, it sends a 200 response with the profile data.
 * If no profile is found, it sends a 404 response.
 */
router.get("/:id",
    (req, res, next) => {
        let creatorId
        Profile.findOne({ username: req.params.id }).then(prof => {
            if (prof) {
                res.status(200).json({
                    message: "Profile fetched successfully!",
                    profile: prof
                });
            } else {
                res.status(404).json({ message: "Profile not found!" });
            }
        });
});

// Export the router to be used in other parts of the application
module.exports = router;