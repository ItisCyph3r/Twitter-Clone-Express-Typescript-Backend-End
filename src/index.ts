import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Feed, User } from './user';
import { IMongoDBUser } from './types';
const GoogleStrategy = require('passport-google-oauth20');
const GitHubStrategy = require('passport-github').Strategy;
let userFeed: any[] = [];

dotenv.config();
const host = '0.0.0.0'
const app: Express = express();
const port = process.env.PORT;

// db config
try {
    mongoose.connect(process.env.USER_SECRET, () => { console.log('Connected to Mongoose successfull') })
} catch (error: any) {
    throw error
}

// middleware
app.set("trust proxy", 1);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "https://zap-twitter-clone.netlify.app", credentials: true }));
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true,
        cookie: {
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user: IMongoDBUser, done: any) => {
    return done(null, user._id);szz
})

passport.deserializeUser((id: string, done: any) => {
    User.findById(id, (error: Error, doc: IMongoDBUser) => {
        return done(null, doc);
    })

})


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
},
    function (_: any, __: any, profile: any, cb: any) {

        User.findOne({ googleId: profile.id }, async function (err: Error, doc: IMongoDBUser) {

            if (!err) {
                if (doc) {
                    return cb(err, doc)
                } else {
                    const formattedName = profile.displayName.split(' ').join('_')
                    console.log(formattedName)
                    User.create({
                        displayName: formattedName + Math.floor(1000 + Math.random() * 9000),
                        userName: formattedName,
                        googleId: profile.id,
                        displayPicture: profile.photos[0].value,
                        isVerified: false
                    }, (err, user) => {
                        return cb(err, user)
                    })
                }
            }
        })
    }
));




passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
},
    function (_: any, __: any, profile: any, cb: any) {
        User.findOne({ githubId: profile.id }, async function (err: Error, doc: IMongoDBUser) {

            if (!err) {
                if (doc) {
                    return cb(err, doc)
                } else {
                    const formattedName = profile.displayName.split(' ').join('_')
                    console.log(formattedName)
                    User.create({
                        displayName: formattedName + Math.floor(1000 + Math.random() * 9000),
                        userName: formattedName,
                        githubId: profile.id,
                        displayPicture: profile.photos[0].value,
                        isVerified: false
                    }, (err, user) => {
                        return cb(err, user)
                    })
                }
            }
        })
    }
));

app
    .route('/auth/google')
    .get(passport.authenticate('google', {
        scope: ['profile']
    }));

app.get('/auth/google/callback',
    // passport.authenticate('google', { failureRedirect: '/login',
    passport.authenticate('google', {
        failureMessage: true
    }),
    function (req, res) {
        res.redirect('https://zap-twitter-clone.netlify.app/home');
        // res.redirect('http://localhost:3000/home');

    });

app
    .route('/auth/github')
    .get(passport.authenticate('github', {
        scope: ['profile']
    }));

app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureMessage: true
    }),
    function (req, res) {
        res.redirect('https://zap-twitter-clone.netlify.app/home');
        // res.redirect('http://localhost:3000/home');
    });

app
    .route('/getuser')
    .get((req, res) => {
        // console.log(req.user)
        res.send(req.user);
    })



app
    .route('/')
    .get((req, res) => {
        res.send('yeaaaah boooy')
    })
let feedArray: any = [];
app
    .route('/api')
    .get(async (req, res) => {

        Feed.find({}, (err: Error, doc: any) => {
            if (err) return err;
            else {
                // console.log(doc.reverse())
                res.json(doc)
            }
        })
    })

    .post(async (req, res) => {
        User.findOneAndUpdate(
            { _id: req.body.user },
            { $push: { tweets: req.body } },
            { $upsert: true, },
            ((err: mongoose.CallbackError, doc: any) => {
                if (err) return console.log(err)
                else {
                    console.log('user tweets updated')
                }
            })
        )

        User.findById(req.body.user, (err: Error, doc: any) => {
            if (err) return err
            else {

                Feed.create({
                    user: req.body.user,
                    userName: doc.userName,
                    displayName: doc.displayName,
                    displayPicture: doc.displayPicture,
                    tweet: req.body.tweet,
                    uuid: req.body.uuid,
                    date: req.body.date
                }, (err: any, doc: any) => {
                    if (err) return err
                    else { console.log("Feeeeeeed updated") }
                })
            }
        })

    })

app
    .route('/delete_tweet')
    .get((req, res) => {

    })
    .post((req, res) => {
        // console.log(req.body.tweet)
        const tweet_id = req.body.tweet
        Feed.findOneAndDelete({ _id: tweet_id }, (err: any, docs: any) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Deleted User : ", docs);
            }
        });
    })

app
    .route('/auth/logout')
    .get((req, res) => {
        if (req.user) {
            req.logout((error) => {
                if (error) return error
            });
            res.send("done")
        }
    })


app.listen(Number(process.env.YOUR_PORT) || process.env.PORT || port, host, () => {
    // console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    console.log('Server is Live!!!')
})
