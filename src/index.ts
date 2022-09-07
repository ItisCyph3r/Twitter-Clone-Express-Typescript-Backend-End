import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import moment from 'moment';

dotenv.config();
const host = '0.0.0.0'
const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(process.env.USER_SECRET, () => {console.log('Connected to Mongoose successfull')})

const postSchema = new mongoose.Schema({
    uuid: Number,
    tweet: String,
    date: String,
    formattedDate: String,
    rawdata: Object
})

const Feed = mongoose.model('feed', postSchema);


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

