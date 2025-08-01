// starting point of a project

const express = require('express');
const { connectDB } = require('./config/database.js');
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");

// create a "/signup" api
// create a "/login" api 
// create a "/profile" api
// create a "/request" api

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



connectDB().then(()=>{
    console.log("DataBase connected successfully");
    app.listen(3000, ()=>{
        console.log("Server is successfully listining on port 3000");
    })
}).catch(err => {
    console.error("Database can't connected");
});
