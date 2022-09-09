import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    uuid: Number,
    tweet: String,
    date: String,
})

// const localUserSchema = new mongoose.Schema({
//     username: String,
//     displayname: String,
//     isValid: Boolean,
//     uniqueString: String,
//     OTP: Number,
// }, {timestamps: true})

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    googleId:{
        required: false,
        type: String
    },
    twitterId:{
        required: false,
        type: String
    },
    displayPicture:{
        required: false,
        type: String
    }
})
// const googleUserSchema = new mongoose.Schema({
//     username: String,
//     googleId: String,
//     picture: String
// }, {timestamps: true})

// const githubUserSchema = new mongoose.Schema({
//     username: String,
//     githubId: String,
//     picture: String
// }, {timestamps: true})

export const Feed = mongoose.model('feed', postSchema);
export const User = mongoose.model('user', userSchema);
// const Local = mongoose.model('LocalUser', localUserSchema);
// const Google =  mongoose.model('GoogleUser', googleUserSchema);

