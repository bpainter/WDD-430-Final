const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const cors = require('cors');
const db = require("./backend/db/db");
const postRouter = require("./backend/Routes/post");
const userRoutes = require("./backend/Routes/user");
const profileRoutes = require("./backend/Routes/profile");

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors());
const directory = path.join(__dirname, './backend/images');
app.use("/images", express.static(directory));

app.use("/api/posts", postRouter)
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, (req,res) => {
  console.log(`app is listening to PORT ${PORT}`)
})