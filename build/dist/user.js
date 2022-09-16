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
    },
    tweets: []
    // tweets: [postSchema]
}, { timestamps: true });
exports.Feed = mongoose_1.default.model('feed', postSchema);
exports.User = mongoose_1.default.model('user', userSchema);
