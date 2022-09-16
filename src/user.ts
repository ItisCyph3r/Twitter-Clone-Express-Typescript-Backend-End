import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    author: String,
    uuid: Number,
    tweet: String,
    date: String,
})

const userSchema = new mongoose.Schema({
    username: {
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
    tweets: []
    // tweets: [postSchema]
}, {timestamps: true})


export const Feed = mongoose.model('feed', postSchema);
export const User = mongoose.model('user', userSchema);
