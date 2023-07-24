/*
 * Import the jsonwebtoken library. This library is used to sign, verify, 
 * and decode JSON Web Tokens (JWT).
 */
const jwt = require("jsonwebtoken");

// Get the JWT secret key from the environment variables.
const jwtSecret = process.env.JWT_SECRET;

/*
 * This middleware function is used to authenticate requests using JWT.
 * It will attempt to get the JWT from the Authorization header, verify it, and decode it.
 * If the JWT is valid, it will attach the decoded data to the request object and call the next middleware function.
 * If the JWT is not valid, it will return a 401 Unauthorized status code and a JSON response with a message of "Authorization failed".
 */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, jwtSecret);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    // console.error("--------- checkauth debug ------------", error);
    res.status(401).json({ message: "Authorization failed" });
  }
};
