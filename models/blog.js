const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    name: String,
    nameURL: String,
    author: String,
    isActive: Boolean,
    datePublished: Date,
    category: String,
    description: String,
    content: String
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;