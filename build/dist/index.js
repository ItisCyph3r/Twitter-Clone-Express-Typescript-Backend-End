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
dotenv_1.default.config();
const host = '0.0.0.0';
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
mongoose_1.default.connect(process.env.USER_SECRET, () => { console.log('Connected to Mongoose successfull'); });
const postSchema = new mongoose_1.default.Schema({
    uuid: Number,
    tweet: String,
    date: String,
    formattedDate: String,
    rawdata: Object
});
const Feed = mongoose_1.default.model('feed', postSchema);
app
    .route('/')
    .get((req, res) => {
    res.send('Express + TypeScript Serverssdsd');
});
app
    .route('/api')
    .get((req, res) => {
    Feed.find((err, doc) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        else {
            res.json({ tweet: doc });
        }
    }));
})
    .post((req, res) => {
    Feed.create(req.body, (err, doc) => {
        if (err)
            throw err;
        else
            console.log(doc);
    });
});
app.listen(Number(process.env.YOUR_PORT) || process.env.PORT || port, host, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
