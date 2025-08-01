const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //reference to the user Collection
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps: true,
});

// connectionRequest.find({fromUserId: 23456787654321234567, toUserId: 876543234567864});
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    // check if the fromUserid is same as a toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Can't send connection request to yourself!");
    }
    next();
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel", connectionRequestSchema)

module.exports = ConnectionRequestModel;