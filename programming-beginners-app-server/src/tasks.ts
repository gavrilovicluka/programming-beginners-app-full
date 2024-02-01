import { generateRandomNumber } from "./utils"

const tasks = [
    'Unositi parne brojeve sve dok je njihova suma manja od 58.',
    'Za 10 razlicitih vrednosti odrediti vrednost funkcije y = { x, x<2  2, 2<=x<3  x-1, x>=3 }',
]

function getTask() {
    const index: number = generateRandomNumber(0, tasks.length - 1);
    return {
        task: tasks[index],
        index: index
    }
}

export { getTask };