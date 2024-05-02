const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    comfirm: {
        type: String,
        required: true
    },
    image:{
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    }
    catch (error) {
        console.log(error);
    }
}

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.comfirm = await bcrypt.hash(this.password, 10);

    }
    next();
});

const Register = mongoose.model('Register', userSchema);

module.exports = Register;