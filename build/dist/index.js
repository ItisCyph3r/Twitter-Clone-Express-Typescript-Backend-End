"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const user_1 = require("./user");
var GoogleStrategy = require('passport-google-oauth20');
var GitHubStrategy = require('passport-github').Strategy;
dotenv_1.default.config();
const host = '0.0.0.0';
const app = (0, express_1.default)();
const port = process.env.PORT;
// db config
mongoose_1.default.connect(process.env.USER_SECRET, () => { console.log('Connected to Mongoose successfull'); });
// middleware
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
app.use((0, express_session_1.default)({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser((user, done) => {
    return done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    return done(null, user);
});
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, function (accessToken, refreshToken, profile, cb) {
    console.log(profile);
    user_1.User.findOne({ googleId: profile.id }, (err, doc) => __awaiter(this, void 0, void 0, function* () {
        if (err)
            return cb(err, null);
        if (!doc) {
            const newUser = new user_1.User({
                displayname: profile.displayname + '1',
                username: profile.displayName,
                googleId: profile.id,
                displayPicture: profile.photos[0].value
            });
            yield newUser.save((error, doc) => {
                if (err)
                    return error;
                else
                    return console.log(doc);
            });
        }
        // else{
        //     User.findOne({ googleId: profile.id }, (err: Error, doc: any) => {
        //         if (err) return cb(err, null)
        //         if (doc)
        //     })
        // }
    }));
    cb(null, profile);
}));
passport_1.default.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/github/callback"
}, function (accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    // return cb(err, user);
    // });
    console.log(profile);
    cb(null, profile);
}));
app
    .route('/auth/google')
    .get(passport_1.default.authenticate('google', {
    scope: ['profile']
}));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login',
    failureMessage: true
}), function (req, res) {
    res.redirect('http://localhost:3000/home');
});
app
    .route('/auth/github')
    .get(passport_1.default.authenticate('github', {
    scope: ['profile']
}));
app.get('/auth/github/callback', passport_1.default.authenticate('github', { failureRedirect: '/login',
    failureMessage: true
}), function (req, res) {
    res.redirect('http://localhost:3000/home');
});
app
    .route('/getuser')
    .get((req, res) => {
    res.send(req.user);
});
app
    .route('/')
    .get((req, res) => {
    res.send('yeaaaah boooy');
});
app
    .route('/api')
    .get((req, res) => {
    user_1.Feed.find((err, doc) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        else {
            // console.log(doc)
            res.json({ tweet: doc });
        }
    }));
})
    .post((req, res) => {
    user_1.Feed.create(req.body, (err, doc) => {
        if (err)
            throw err;
        else
            console.log(doc);
    });
});
app
    .route('/delete_tweet')
    .get((req, res) => {
})
    .post((req, res) => {
    console.log(req.body.tweet);
    const tweet_id = req.body.tweet;
    user_1.Feed.findOneAndDelete({ _id: tweet_id }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Deleted User : ", docs);
        }
    });
});
app.listen(Number(process.env.YOUR_PORT) || process.env.PORT || port, host, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
