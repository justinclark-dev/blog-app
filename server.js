// server.js

const dotenv = require('dotenv');
dotenv.config({ quiet: true });
const express = require('express');

const app = express();

const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");

// This middleware parses incoming request bodies, 
// extracting form data and converting it into a 
// JavaScript object. It then attaches this object 
// to the req.body property of the request, making 
// the form data easily accessible within our route 
// handlers.
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

const Blog = require('./models/blog.js');

// GET /
app.get('/', (req, res) => {
    res.send('Yo, it works!');
});

// GET /blog
app.get("/blog", async (req, res) => {
    const allBlogs = await Blog.find();
    res.render("blog/index.ejs", { blogs: allBlogs });
});

// GET /blog/new
app.get("/blog/new", (req, res) => {
    res.render("blog/new.ejs");
});

// GET /blog/:blogId
app.get("/blog/:blogId", async (req, res) => {
    const foundBlog = await Blog.findById(req.params.blogId);
    res.render("blog/show.ejs", { blog: foundBlog });
});

// POST /blog
app.post("/blog", async (req, res) => {
    if (req.body.isActive === "on") {
        req.body.isActive = true;
    } else {
        req.body.isActive = false;
    }
    await Blog.create(req.body);
    res.redirect("/blog");
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
