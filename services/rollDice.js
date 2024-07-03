import { MESSAGE_TEXT } from '../constants/messages.js';
import {
    DEFAULT_ROLL,
    ROLL_REMOVE,
    N_ROLL,
    D_ROLL,
    CHARACTER_ROLL,
} from '../constants/regex.js';

const DEFAULT_DICE = 20;
const ROLL_REPLACE_TEXT = '%roll!';

export function handleRoll(msg) {
    try {
        const { content } = msg;
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
            return createResponseText(
                rollDiceNTimes(+numberOfDice, +diceSize).rollResultsStr
            );
        }
        if (content.match(CHARACTER_ROLL)) {
            return createResponseText(rollCharacter());
        }
        throw new Error('Unknown dice roll commant');
    } catch (error) {
        console.error('Failed to handle roll', {
            content: msg.content,
            error: JSON.stringify(error),
            message: 'Failed to roll dice',
            errorMessage: error.message,
        });
        return MESSAGE_TEXT.UNKNOWN_ERROR;
    }
}

export function rollDice(n = DEFAULT_DICE) {
    return Math.ceil(Math.random() * n);
}

function removeRollText(content) {
    return content.replace(ROLL_REMOVE, '');
}

function rollDiceNTimes(numberOfDice, diceSize) {
    let sum = 0;
    const rollResults = [];
    for (let i = 0; i < numberOfDice; i++) {
        const rollResult = rollDice(diceSize);
        rollResults.push(rollResult);
        sum += rollResult;
    }
    const rollResultsStr =
        rollResults.length === 1
            ? `(${sum})`
            : `${sum}(${rollResults.join('+')})`;
    return { sum, rollResultsStr };
}

function rollCharacter() {
    const characterResults = [];
    for (const i = 0; i < 6; i++) {
        characterResults.push(rollDiceNTimes(3, 6));
    }
    return characterResults.join(',');
}

function createResponseText(result) {
    if (typeof result === 'string') {
        return MESSAGE_TEXT.ROLL_RESPONSE.replace(ROLL_REPLACE_TEXT, result);
    }
    if (result !== 1) {
        return MESSAGE_TEXT.ROLL_RESPONSE.replace(ROLL_REPLACE_TEXT, result);
    }
    return `Oof! ${MESSAGE_TEXT.ROLL_RESPONSE.replace(ROLL_REPLACE_TEXT, result)}`;
}
