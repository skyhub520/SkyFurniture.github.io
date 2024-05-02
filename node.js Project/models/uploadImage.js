const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true
    }
});


const uploadImage = mongoose.model('Image', uploadSchema);

module.exports = uploadImage;