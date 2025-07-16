// starting point of a project

const express = require('express');

const app = express();

// this will only handle GET call from /user
app.get("/user",(req, res) => {
    res.send({
        firstName:"Vanktesh",
        lastName: "Dixit"
    })
});

// saving data to database
app.post("/user", (req, res)=>{
    res.send("Data successfully saved to database")
});

app.delete("/user", (req, res)=>{
    res.send("Deleted successfully");
})

// this will match all the http method to /test
app.use("/test",(req, res)=> {
    res.send("Hello from the server!");
})

app.listen(3000, ()=>{
    console.log("Server is sucessfully listining on PORT 3000....");
});