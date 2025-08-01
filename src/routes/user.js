const express = require('express');
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

const USER_SAFE_DATA = "firstName lastName photoUrl gender age skills about";
// get all the pending connection request for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        })
    } catch (error) {
        req.statusCode(400).send("Error: " +error.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id, status:"accepted"},
                {fromUserId: loggedInUser._id, status:"accepted"},
            ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequests.map(row => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }    
            return row.fromUserId
        });

        res.json({data})

    } catch (error) {
        res.status(400).status({message: error.message});
    }
})

userRouter.get("/feed", userAuth, async(req, res)=>{
    try {
        // user shoud not see others card expect then himself
        // not see the card again who has friend or ignored if already send the connectiion request to someone

        const loggedInUser = req.user;
        // find all connection req that i have sent + recieved
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id}, 
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        // loop through all the connectionRequests
        // set contains all the Unique value
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // reverse query kind of a thing
        const users = await User.find({
            // nin => not in this array
            $and: [
            {_id: {$nin: Array.from(hideUsersFromFeed)}},
            {_id: {$ne: loggedInUser._id}},
        ]
        }).select(USER_SAFE_DATA);

        res.send(users);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

module.exports = userRouter;