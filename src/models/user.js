const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        maxLength: 50,
    },
    emailId: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Not a strong password " );
            }
        }
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        // custom validation function
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Invalid gender");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url: " + value);
            }
        }
    },
    about: {
        type: String,
        default: "User about"
    },
    skills: {
        type: [String]
    }
},{
    timestamps: true,
});


module.exports = mongoose.model("User", userSchema);