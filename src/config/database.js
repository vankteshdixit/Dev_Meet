const mongoose = require('mongoose');

const connectDB = async()=>{
    mongoose.connect(
        "mongodb+srv://dixitvanktesh2003:Vankteshdixit@devlopermeet.ukutgok.mongodb.net/DevMeet"
    );
};

module.exports={
    connectDB
};