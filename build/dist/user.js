"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Feed = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    author: String,
    uuid: Number,
    tweet: String,
    date: String,
});
// const localUserSchema = new mongoose.Schema({
//     username: String,
//     displayname: String,
//     isValid: Boolean,
//     uniqueString: String,
//     OTP: Number,
// }, {timestamps: true})
const userSchema = new mongoose_1.default.Schema({
    username: {
        required: true,
        type: String
    },
    displayName: {
        required: false,
        type: String
    },
    googleId: {
        required: false,
        type: String
    },
    githubId: {
        required: false,
        type: String
    },
    displayPicture: {
        required: false,
        type: String
    }
}, { timestamps: true });
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
exports.Feed = mongoose_1.default.model('feed', postSchema);
exports.User = mongoose_1.default.model('user', userSchema);
// const Local = mongoose.model('LocalUser', localUserSchema);
// const Google =  mongoose.model('GoogleUser', googleUserSchema);
