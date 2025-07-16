// starting point of a project

const express = require('express');

const app = express();

app.use("/",(req, res)=>{
    res.send("Hello from home page");
});

app.use("/hello",(req, res) => {
    res.send("Hello");
})

app.use("/test",(req, res)=> {
    res.send("Hello from the server!");
})

app.listen(3000, ()=>{
    console.log("Server is sucessfully listining on PORT 3000....");
});