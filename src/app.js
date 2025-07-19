// starting point of a project

const express = require('express');
const { connectDB } = require('./config/database.js');
const app = express();
const User = require('./models/user.js');

app.use(express.json());

app.post("/signup",async(req, res)=>{
    // creating a new instance if a new user model
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User added successfully!");
    } catch (error) {
        res.status(400).send("Error saving in the user" + error.message);
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
app.patch("/user", async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({_id:userId}, data);
        res.send("User updated successfully");
    } catch (error) {
        res.status(400).send("Something went wrong");
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
