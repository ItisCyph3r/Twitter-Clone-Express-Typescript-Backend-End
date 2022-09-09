import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Feed, User } from './user';
import { IUser } from './types';
var GoogleStrategy = require('passport-google-oauth20');
var GitHubStrategy = require('passport-github').Strategy;

dotenv.config();
const host = '0.0.0.0'
const app: Express = express();
const port = process.env.PORT;

// db config

mongoose.connect(process.env.USER_SECRET, () => {console.log('Connected to Mongoose successfull')})


// middleware

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true}));
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user: any, done: any) => {
    return done(null, user._id);
})

passport.deserializeUser((id: string, done: any) => {
    User.findById(id, (error: Error, doc: IUser) => {
        return done(null, doc);
    })
    
})


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
},
function (accessToken: any, refreshToken: any, profile: any, cb: any) {

    console.log(profile)
    

    User.findOne({ googleId: profile.id}, async (err: Error, doc: IUser) => {
        
        if (err) return cb(err, null)

        if(!doc){
            const newUser = new User({
                displayname: profile.displayname + '1',
                username: profile.displayName,
                googleId: profile.id,
                displayPicture: profile.photos[0].value
            });

            await newUser.save((error, doc) => {
                if (err) return error
                else return console.log(doc)
            });
            cb(null, newUser)
        }
        cb(null, doc)
    })
}
));




passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/github/callback"
    },
    function(accessToken: any, refreshToken: any, profile: any, cb: any) {
        console.log(profile)

        User.findOne({ githubId: profile.id}, async (err: Error, doc: IUser) => {
            
            if (err) return cb(err, null)

            if(!doc){
                const newUser = new User({
                    displayname: profile.username + '1',
                    username: profile.username,
                    githubId: profile.id,
                    displayPicture: profile.photos[0].value
                });

                await newUser.save((error, doc) => {
                    if (err) return error
                    else return console.log(doc)
                });
                cb(null, newUser)
            }
            cb(null, doc)
        })

        
})
);

app
    .route('/auth/google')
    .get(passport.authenticate('google', {
        scope: ['profile']
    }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login',
        failureMessage: true
    }),
    function (req, res) {
        res.redirect('http://localhost:3000/home');
    });

app
    .route('/auth/github')
    .get(passport.authenticate('github', {
        scope: ['profile']
    }));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login',
        failureMessage: true
    }),
    function (req, res) {
        res.redirect('http://localhost:3000/home');
    });

app
    .route('/getuser')
    .get((req, res) => {
        res.send(req.user);
    })



app
.route('/')
.get((req, res) => {
    res.send('yeaaaah boooy')
})

app
.route('/api')
.get((req, res) => {
    Feed.find(async(err: any, doc: any) => {
        if (err) throw err
        else { 
            // console.log(doc)
            res.json({ tweet: doc })   
        }
    })
})
.post((req, res) => {
    Feed.create(req.body, (err: any, doc: any) =>{
        if (err) throw err;
        else console.log(doc);
    })
})

app
.route('/delete_tweet')
.get((req, res) => {
    
})
.post((req, res) => {
    console.log(req.body.tweet)
    const tweet_id = req.body.tweet
    Feed.findOneAndDelete({_id: tweet_id }, (err: any, docs: any) => {
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted User : ", docs);
        }
    });
})

app.listen(Number(process.env.YOUR_PORT) || process.env.PORT || port, host, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
})

