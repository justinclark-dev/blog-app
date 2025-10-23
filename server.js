// server.js

const dotenv = require('dotenv');
dotenv.config({ quiet: true });
const express = require('express');

const app = express();

const mongoose = require('mongoose');

const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require('body-parser');



// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());


// This middleware parses incoming request bodies, 
// extracting form data and converting it into a 
// JavaScript object. It then attaches this object 
// to the req.body property of the request, making 
// the form data easily accessible within our route 
// handlers.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));


mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

const Blog = require('./models/blog.js');

// GET /
app.get('/', (req, res) => {
    res.render('index.ejs', { 
        page: { title: 'Welcome to my blog!' }
    });
});

// GET /blog
app.get("/blog", async (req, res) => {
    const allBlogs = await Blog.find();
    res.render("blog/index.ejs", { 
        page: { title: 'All Blog Posts' },
        blogs: allBlogs 
    });
});

// GET /blog/new
app.get("/blog/new", (req, res) => {
    res.render("blog/new.ejs", { 
        page: { title: 'Create a Blog Post' }
    });
});

// GET /blog/:id
app.get("/blog/:id", async (req, res) => {
    const foundBlog = await Blog.findById(req.params.id);
    res.render("blog/show.ejs", { 
        page: { title: foundBlog.name },
        blog: foundBlog
    });
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

// PUT /blog/:id
app.put("/blog/:id", async (req, res) => {
    // Handle the 'isActive' checkbox data
    if (req.body.isActive === "on") {
        req.body.isActive = true;
    } else {
        req.body.isActive = false;
    }
    console.log('start content')
    console.log(req.body.content)
    console.log('end content')
  


    // Update the blog in the database
    await Blog.findByIdAndUpdate(req.params.id, req.body);

    // Redirect to the blog's show page to see the updates
    res.redirect(`/blog/${req.params.id}`);
});

// DELETE /blog/:id
app.delete("/blog/:id", async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/blog");
});

// GET /blog/:id/edit
app.get("/blog/:id/edit", async (req, res) => {
    const foundBlog = await Blog.findById(req.params.id);

    
    res.render("blog/edit.ejs", {
        page: { title: 'Edit Blog Post' },
        blog: foundBlog,
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
