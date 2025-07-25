const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user.js');
const bcrypt = require("bcrypt");


authRouter.post("/signup",async(req, res)=>{
    
    // creating a new instance if a new user model
    
    try {
        // Validation of data
        // create a helper function in a folder UTILS

        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;
        // Encrypt the password
        // Bcrypt
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User added successfully!");
    } catch (error) {
        res.status(400).send("Error " + error.message);
    }
});

authRouter.post("/login", async(req,res) => {
    try {
        const {emailId, password} = req.body;
        
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){

            // create a JWT token
            // we are hiding the user {id} inside the JWT token by the help of the below line
            // const token = await jwt.sign({_id: user._id},"secret key that only server knows")
            // Add the token to cookie and send the response back to the user
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("Login Successful!!");
        }
        else{
            throw new Error("Invalid credentials");
        }

    } catch (error) {
        res.status(400).send("Error: "+ error.message);
    }
});



module.exports= authRouter;