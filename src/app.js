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

connectDB().then(()=>{
    console.log("DataBase connected successfully");
    app.listen(3000, ()=>{
        console.log("Server is successfully listining on port 3000");
    })
}).catch(err => {
    console.error("Database can't connected");
});
