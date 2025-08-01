const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const {validateProfileEditData} = require("../utils/validation.js");
const bcrypt = require("bcrypt");


profileRouter.get("/profile/view", userAuth, async(req, res)=>{
    try {
        const user = req.user;
        res.send(user);

    } catch (error) {
        res.status(400).send("Error: " +error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res)=>{
    try {
        if(!validateProfileEditData(req)){
            throw new Error("Invalid edit request")
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser,
        });
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).send("Both old and new passwords are required.");
        }

        const user = req.user;

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).send("Old password is incorrect.");
        }

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.send("Password updated successfully.");
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});




module.exports =  profileRouter;