import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

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
    res.send('Express + TypeScript Serverssdsd');
})

app
.route('/api')
.get((req, res) => {
    Feed.find(async(err: any, doc: any) => {
        if (err) throw err
        else { res.json({ tweet: doc }) }
    })
})
.post((req, res) => {
    Feed.create(req.body, (err: Error, doc: any) =>{
        if (err) throw err;
        else console.log(doc);
    })
})

app.listen(Number(process.env.YOUR_PORT) || process.env.PORT || port, host, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
})

