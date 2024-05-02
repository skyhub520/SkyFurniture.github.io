const jwt = require('jsonwebtoken');
const Register = require('../models/register');


const auth = async (req, res, next) => {
    err = { err: 'jwt must be provided' }
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const user = await Register.findOne({ _id: verifyUser._id });
        
        req.token = token;
        req.user = user;
        console.log(user);
        next();
    }
    catch (error) {      
        res.status(401).render("login", err) 
        console.log(error);
        
    }

}


module.exports = auth;