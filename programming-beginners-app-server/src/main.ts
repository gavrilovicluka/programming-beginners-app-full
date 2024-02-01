import { EvenNumbersSum } from "./task-even-numbers-sum";
import { simulateAI } from "./utils";
import express from 'express';
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

let goalValue: number = 0;
let currentSum: number = 0;
let currentNumbers: number[] = [];
let disableInput: boolean = false;
let disableButton: boolean = false;
let isFirstPartFinished: boolean = false;
let firstStepStartFlag: boolean = true;
let firstStepAnswer: boolean = false;
let firstStepAgain: boolean = false;
let secondStepStartFlag: boolean = true;
let secondStepAnswer: boolean = false;
let secondStepAgain: boolean = false;
let owlImage: string = '';
let text: string = '';
let finishedTaskTraining: boolean = false;
let taskText: string = '';
let task: EvenNumbersSum;

app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});

app.post('/sendMessage', (req, res) => {
    const userMessage = req.body.userMessage;
    
    const response = simulateAI(userMessage);

    res.send(response);


});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


