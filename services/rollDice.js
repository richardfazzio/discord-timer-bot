import { MESSAGE_TEXT } from '../constants/messages.js';

const DEFAULT_DICE = 20;
const ROLL_REPLACE_TEXT = '%roll!';

const DEFAULT_ROLL = /^!roll\s*$/i;
const ROLL_REMOVE = /^!roll\s*/i;
const N_ROLL = /^!roll\s*\d+$/i;
const D_ROLL = /^!roll\s+\d+d\d+$/i;

export function handleRoll(msg) {
    try {
        const { content } = msg;
        console.log(content, msg);
        if (content.match(DEFAULT_ROLL)) {
            return createResponseText(rollDice());
        }
        if (content.match(N_ROLL)) {
            const n = +removeRollText(content);
            return createResponseText(rollDice(n));
        }
        if (content.match(D_ROLL)) {
            const dString = removeRollText(content);
            const [numberOfDice, diceSize] = dString.split(/d/i);
            return createResponseText(rollDiceNTimes(+numberOfDice, +diceSize));
        }
        throw new Error('Unknown dice roll commant');
    } catch (error) { 
        console.error('Failed to handle roll',   {
            content: msg.content,
            error: JSON.stringify(error),
            message: 'Failed to roll dice',
            errorMessage: error.message,
        });
        return MESSAGE_TEXT.UNKNOWN_ERROR;
    }
}

function removeRollText(content) {
    return content.replace(ROLL_REMOVE, '');
}

function rollDiceNTimes(numberOfDice, diceSize) {
    let sum = 0;
    for (let i = 0; i < numberOfDice; i++) {
        sum += rollDice(diceSize);
    }
    return sum;
}

function rollDice(n = DEFAULT_DICE) {
    return Math.ceil(Math.random() * n);
}

function createResponseText(n) {
    if (n !== 1) {
        return MESSAGE_TEXT.ROLL_RESPONSE.replace(ROLL_REPLACE_TEXT, n);
    }
    return `Oof! ${MESSAGE_TEXT.ROLL_RESPONSE.replace(ROLL_REPLACE_TEXT, n)}`;
}
