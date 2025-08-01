const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user.js");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res)=>{
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
        const allowedStatus = ["ignored", "interested"];
        
        if(!allowedStatus.includes(status)){
            return res
            .status(400)
            .json({message: "invalid status type: "+ status});
        }



        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({
                message:"User not found!"
            });
        };

        
        // Check if there is an existing Connection request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            // fromUserId: fromUserId, toUserId: toUserId
            // or
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
        });

        if(existingConnectionRequest){
            return res.status(400).send({message: "Connection request already Exists!!"});
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName+" is " + status +" in " + toUser.firstName,
            data,
        });

    } catch (error) {
        res.status(400).send("ERROR" + error.message);
    }

});

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res)=>{
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        // Logic to accept/reject request
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Status is not allowed"})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });

        if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found"});
        }
        connectionRequest.status=status;
        const data = await connectionRequest.save();
        res.json({message: "Connection request "+ status, data});
    } catch (error) {
        res.status(400).send("Error: "+ error.message);
    }
});



module.exports = requestRouter;