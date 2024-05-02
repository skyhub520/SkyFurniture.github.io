const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content:{
        type: String
    },
    slug: {
        type: String
    },
    date:{
        type: Date,
        default:Date.now
    }

});
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
