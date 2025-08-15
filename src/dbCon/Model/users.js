
const { default: mongoose } = require("mongoose");

const usersModel = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true 
    },
    password:{
        type: String,
        required: true
    }
});

export const User = mongoose.models.users || mongoose.model("users",usersModel);