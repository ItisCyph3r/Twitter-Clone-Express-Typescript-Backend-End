import mongoose from "mongoose";

const feedSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    displayPicture: {
        type: String,
        required: true
    },
    uuid: {
        type: Number,
        required: true
    },
    tweet: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
})

const userSchema = new mongoose.Schema({
    userName: {
        required: true,
        type: String
    },
    displayName: {
        required: false,
        type: String
    },
    googleId:{
        required: false,
        type: String
    },
    githubId:{
        required: false,
        type: String
    },
    displayPicture:{
        required: false,
        type: String
    },
    isVerified: {
        required: false,
        type: Boolean
    },  
    tweets: []
}, {timestamps: true})


export const Feed = mongoose.model('feed', feedSchema);
export const User = mongoose.model('user', userSchema);
