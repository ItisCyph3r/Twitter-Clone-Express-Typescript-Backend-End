"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Feed = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const feedSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
});
const userSchema = new mongoose_1.default.Schema({
    userName: {
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
    isVerified: {
        required: false,
        type: Boolean
    },
    tweets: []
    // tweets: []
    // tweets: [postSchema]
}, { timestamps: true });
exports.Feed = mongoose_1.default.model('feed', feedSchema);
exports.User = mongoose_1.default.model('user', userSchema);
