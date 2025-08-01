const validator = require("validator");

// The req.body object allows you to access this data in a parsed format
const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Please enter a valid name!");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid email!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a Strong password!");
    }
};

const validateProfileEditData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ];
    const isEditAllowed = Object.keys(req.body).every(field => 
        allowedEditFields.includes(field)
    );
    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateProfileEditData,
};