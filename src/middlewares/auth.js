const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) =>{
    // Read the token from the req cookies
    try {
        const cookies = req.cookies;
        const {token} = cookies;

        if(!token){
            throw new Error("Token is not valid");
        }
    
        const decodedObj = await jwt.verify(token, "vank@12@#@$%%@!");
    
        const {_id} = decodedObj;;
    
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("Error: "+ error.message);
    }
    // validate the token
    // find the user
};


module.exports = {
    userAuth
}