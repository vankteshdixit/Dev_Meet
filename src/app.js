// starting point of a project

const express = require('express');
const { connectDB } = require('./config/database.js');
const app = express();
const User = require('./models/user.js');
const {validateSignUpData} =require("./utils/validation.js");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup",async(req, res)=>{
    
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



// GET user by email
app.get("/user",async(req,res)=>{
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({emailId: userEmail});
        if(users.length === 0){
            res.status(404).send("User not found");
        }else{
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

// Feed API - GET /feed -get all the users from the database
app.get("/feed", async(req, res)=>{
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

// delete the user from the database
app.delete("/user", async(req, res)=>{
    const userId = req.body.userId;
    try {
        // const user = await User.findByIdAndDelete({_id: userId});
        // or
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

// Update the user 
app.patch("/user/:userId", async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
// this is to allow the updates on some fields with the help of API validations
    try {
        const ALLOWED_UPDATES = [
        "photoUrl",
        "about",
        "skills",
        "password",
        "gender",
    ]
        const isUpdateAllowed = Object.keys(data).every(k => 
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length >= 10){
            throw new Error("Skills can't be more than 10")
        }

        const user = await User.findByIdAndUpdate({_id: userId}, data,{
            returnDocument:"after",
            runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully");
    } catch (error) {
        res.status(400).send("Update failed: " + error.message);
    }
})

connectDB().then(()=>{
    console.log("DataBase connected successfully");
    app.listen(3000, ()=>{
        console.log("Server is successfully listining on port 3000");
    })
}).catch(err => {
    console.error("Database can't connected");
});
