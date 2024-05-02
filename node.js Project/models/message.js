const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
});
const Contact = mongoose.model('Contact', messageSchema);

module.exports = Contact;
