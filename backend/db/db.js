/*
 * Import the mongoose library. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. 
 * It manages relationships between data, provides schema validation, and is used
 * to translate between objects in code and the representation of those objects in MongoDB.
 */
const mongoose = require('mongoose');

// Set mongoose's Promise to use the global Promise object.
mongoose.Promise = global.Promise;

// Get the MongoDB connection string from .env.
const mongoSecret = process.env.MONGO_SECRET;
const url = `mongodb+srv://wdd430final:` + mongoSecret + `@wdd-430-final.qezpn7s.mongodb.net/?retryWrites=true&w=majority`;

/*
 * Connect to MongoDB at default port 27017.
 * This function will attempt to connect to MongoDB using the connection string 
 * provided in the environment variables.
 * It will log success or failure messages to the console.
 */
async function connectToMongo() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('The connection to MongoDB succeeded.');
    } catch (err) {
        console.log('The connection to MongoDB failed: ' + err);
    }
}

// Call the function to connect to MongoDB.
connectToMongo();
