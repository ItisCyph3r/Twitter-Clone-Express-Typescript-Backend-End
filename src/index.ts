import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose, { Mongoose } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Feed, User } from './user';
import { IMongoDBUser, IUser } from './types';
const GoogleStrategy = require('passport-google-oauth20');
const GitHubStrategy = require('passport-github').Strategy;

dotenv.config();
const host = '0.0.0.0'
const app: Express = express();
const port = process.env.PORT;

// db config

mongoose.connect(process.env.USER_SECRET, () => {console.log('Connected to Mongoose successfull')})


// middleware

app.use(bodyParser.urlencoded({extended: true}));
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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
},
async (_: any, __: any, profile: any, cb: any) => {

    // console.log(profile)
    

    User.findOne({ googleId: profile.id}, async (err: Error, doc: IMongoDBUser) => {
        
        if (err) {
            console.log('Fuck you there is an error')
            cb(err, null)
        }

        if(!doc){
            const newUser = new User({
                displayName: profile.displayname + Math.floor(1000 + Math.random() * 9000),
                username: profile.displayName,
                googleId: profile.id,
                displayPicture: profile.photos[0].value
            });

            await newUser.save((error, doc) => {
                if (err) return error
                else return console.log(doc)
            });

            cb(null, newUser)
            // cb(null, profile)
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
    function (_: any, __: any, profile: any, cb: any) {
        // console.log(profile)

        User.findOne({ githubId: profile.id}, async (err: Error, doc: IMongoDBUser) => {
            
            if (err) return cb(err, null)

            if(!doc){
                const newUser = new User({
                    displayName: profile.username + Math.floor(1000 + Math.random() * 9000),
                    username: profile.username,
                    githubId: profile.id,
                    displayPicture: profile.photos[0].value
                });

                await newUser.save((error, doc) => {
                    if (err)
                        return error;
                    else
                        return console.log(doc);
                });
                cb(null, newUser)
                
            }
            cb(null, doc)
        })
    }
));

app
    .route('/auth/google')
    .get(passport.authenticate('google', {
        scope: ['profile']
    }));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureMessage: true
    }),
    function (req, res) {
        res.redirect('http://localhost:3000/home');
    });

// app.get('/auth/google/callback', (req, res) => {
//     passport.authenticate('google', {
//         failureMessage: true
//     }),
//     function (req: any, res: any) {
//         res.redirect('http://localhost:3000/home');
//     }
// })
    

    

app
    .route('/auth/github')
    .get(passport.authenticate('github', {
        scope: ['profile']
    }));

app.get('/auth/github/callback',
    // passport.authenticate('github', { failureRedirect: '/login',
    passport.authenticate('github', {
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

    User.find({}, async (err: Error, doc: any) => {
        if (err) return err;
        else {
            // console.log(doc)
            // console.log(doc[0].tweets)
            const feedData: {[key:number]: Object} = {};
            // await doc.forEach((element: any) => {
            //     // console.log(element.username)
            //     feedData = {
            //         username: element.username, 
            //         displayName: element.displayName, 
            //         displayPicture: element.displayPicture, 
            //         tweet: element.tweets
            //     };
            // })
            for (var i = 0; i < doc.length; i++) {

                feedData[i] = {
                    username: doc[i].username, 
                    displayName: doc[i].displayName, 
                    displayPicture: doc[i].displayPicture, 
                    tweet: doc[i].tweets
                };
            }
            // await console.log(feedData)
            
            await res.json({feed: feedData})
            
        }
    })
})

.post((req, res) => {
    console.log(req.body)

    User.findOneAndUpdate(
        {
            _id: req.body.id
        },
        {
            $push: {
                tweets: req.body
            },
        },
        {$upsert: true,},
        ((err: mongoose.CallbackError, doc: any) => {
            if(err) return console.log(err)
            else {
                // console.log(doc)
            }
        })
    )
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

app
.route('/auth/logout')
.get((req, res) => {
    if(req.user){
        req.logout((error) => {
            if (error) return error
        });
        // res.send("Logout Successful")
    }
})


app.listen(Number(process.env.YOUR_PORT) || process.env.PORT || port, host, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
})

