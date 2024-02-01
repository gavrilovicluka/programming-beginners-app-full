import { EvenNumbersSum } from "./task-even-numbers-sum";
import { getTask } from "./tasks";

let finishedTaskTraining: boolean = false;
let task: EvenNumbersSum;
let taskText: string = '';

function simulateAI(userMessage: string) {
    const lowerCaseUserMessage = userMessage.toLowerCase();
    const getTaskKeywords = ['posalji', 'daj', 'generisi'];
    const getTaskTrainingKeywords = ['uvodni', 'trening'];
    const sendTask = getTaskKeywords.some(keyword => lowerCaseUserMessage.includes(keyword));
    const sendTaskTraining = getTaskTrainingKeywords.some(keyword => lowerCaseUserMessage.includes(keyword));

    let response;

    if (sendTask && !sendTaskTraining) {
        // Slanje zadatka
        const taskInfo = getTask();
        response = {
            task: taskInfo.task
        }

        switch (taskInfo.index) {
            case 0:
                task = new EvenNumbersSum(taskInfo.task);
                break;

            case 1:
                // task = new EvenNumbersSum();
                break;

            default:
                break;
        }
    } else if (sendTask && sendTaskTraining) {
        // Slanje uvodnog zadatka
        const taskTraining = task.getTaskTraining(userMessage);
        taskText = userMessage;
        response = {
            taskTraining: taskTraining
        }
    } else {
        if (!finishedTaskTraining) {
            const reply = task.taskTrainingReply(taskText, userMessage);
            const replyMessage: string = reply.reply;
            const isValid: boolean = reply.success;

            response = {
                message: replyMessage
            }

            if (isValid) {
                finishedTaskTraining = true;
            }
        } else {
            const reply: string = task.generateReply(userMessage);
            response = {
                message: reply
            }
        }
    }
    
    return response;
}

function getNumberFromText(text: string): number {
    const messageSplit = text.split(' ');
    let number: number = -1;
    messageSplit.forEach(part => {
        if (!isNaN(parseInt(part))) {
            number = parseInt(part);
        }
    })

    return number;
}

function isEven(num: number): boolean {
    if (num % 2 === 0) {
        return true;
    }
    return false;
}

function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomNumbers(): number[] {
    const numbers: number[] = [];

    for (let i = 0; i < 10; i++) {
        let newNumber = generateRandomNumber(1, 50);

        while (numbers.includes(newNumber)) {
            newNumber = generateRandomNumber(1, 50);
        }

        numbers.push(newNumber);
    }

    return numbers;
}

function getNumbersFromString(string: string): number[] {
    // Regularni izraz za pronalazenje svih brojeva u stringu
    var regex = /\d+(\.\d+)?/g;
    var numbers = [];
    var match;

    // Pronalazenje svih brojeva u stringu i smestanje u niz
    while ((match = regex.exec(string)) !== null) {
        numbers.push(parseFloat(match[0]));
    }

    return numbers;
}

function checkEvenNumbers(selectedNumbers: number[], generatedNumbers: number[]) {
    let selectedEvenNumbers = 0;
    let selectedOddNumbers = 0;
    let validSelection = false;

    selectedNumbers.forEach(number => {
        if (number % 2 === 0) {
            selectedEvenNumbers++;
        } else {
            selectedOddNumbers++;
            validSelection = false;
        }
    })

    if (selectedOddNumbers === 0 && selectedEvenNumbers === numOfEvenNumbers(generatedNumbers)) {
        validSelection = true;
    } else {
        validSelection = false;
    }

    return validSelection;
}


function numOfEvenNumbers(numbers: number[]): number {
    let evenNumbers: number = 0;

    numbers.forEach(number => {
        if (number % 2 === 0) {
            evenNumbers++;
        }
    });

    return evenNumbers;
}

export { simulateAI, getNumberFromText, isEven, generateRandomNumber, generateRandomNumbers, getNumbersFromString, checkEvenNumbers }