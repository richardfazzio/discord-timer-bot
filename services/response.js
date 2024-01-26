import { MESSAGE_TEXT } from '../constants/messages.js';
import { ACTIONS_REGEX, WHITE_SPACE } from '../constants/regex.js';
import { handleCombatInitiative } from './combatInitiative.js';
import { replyToMessage, sendMessageByChannelId } from './discordClient.js';
import { handleRoll } from './rollDice.js';

const timers = new Map(); // Ongoing timers in memory
// Takes in string msg and returns a response

//https://discord.com/api/oauth2/authorize?client_id=1091817482697850959&permissions=68608&scope=bot

const MAX_TIMER = 60; // Time in minutes

const HELP_MESSAGES = [
    MESSAGE_TEXT.HELP_DESCRIPTION,
    MESSAGE_TEXT.ROLL_DESCRIPTION,
];

export function handleResponse(msg) {
    if (msg.content.match(ACTIONS_REGEX.HELP)) {
        return HELP_MESSAGES.reduce((acc, val) => (acc += val), '');
    }
    if (msg.content.match(ACTIONS_REGEX.ROLL)) {
        return handleRoll(msg);
    }
    if (msg.content.match(ACTIONS_REGEX.COMBAT_INITIATIVE)) {
        return handleCombatInitiative(msg);
    }
    if (msg.content.match(ACTIONS_REGEX.START_TIMER)) {
        return handleStartTimer(msg);
    }
    if (msg.content.match(ACTIONS_REGEX.STOP_TIMER)) {
        return handleStopTimer(msg);
    }
}

function handleStartTimer(msg) {
    const { content, author, channelId } = msg;
    const [_, minutesString] = content.split(WHITE_SPACE);
    const minutes = +minutesString;
    const userId = author.id;
    const timer = timers.get(userId);
    if (timer) {
        return MESSAGE_TEXT.TIMER_ALREADY_EXISTS;
    }
    if (isNaN(minutes)) {
        return MESSAGE_TEXT.NUMBER_REQUIRED;
    }
    if (minutes > MAX_TIMER) {
        return MESSAGE_TEXT.TIMER_TOO_LARGE.replaceAll(
            '%max',
            MAX_TIMER
        ).replace('%time', minutes);
    }
    const intervalId = setInterval(
        () => handleTimer(userId),
        convertMinutesToMS(1)
    );
    timers.set(userId, {
        userId,
        intervalId,
        msg,
        remainingCount: minutes,
    });
    sendMessageByChannelId(
        channelId,
        MESSAGE_TEXT.TIMER_STARTED.replace('%t', minutes)
    );
}

function handleTimer(userId) {
    const timer = timers.get(userId);
    if (!timer) {
        console.error(`Orphaned interval with id: ${userId}`);
        return;
    }
    let { intervalId, msg, remainingCount } = timer;
    remainingCount--;
    if (remainingCount < 1) {
        clearInterval(intervalId);
        timers.delete(userId);
        sendMessageByChannelId(msg.channelId, MESSAGE_TEXT.TIMER_ENDED);
        return;
    }
    const reply =
        remainingCount > 1
            ? MESSAGE_TEXT.TIMER_MINUTES_REMAINING.replace('%t', remainingCount)
            : MESSAGE_TEXT.TIMER_MINUTE_REMAINING;
    timers.set(userId, {
        ...timer,
        remainingCount,
    });
    sendMessageByChannelId(msg.channelId, reply);
}

function handleStopTimer(msg) {
    const userId = msg.author.id;
    const timer = timers.get(userId);
    if (!timer) {
        msg.reply(MESSAGE_TEXT.TIMER_NOT_FOUND);
        return;
    }
    clearInterval(timer.intervalId);
    timers.delete(userId);
    replyToMessage(msg, MESSAGE_TEXT.TIMER_ENDED);
}

function convertMinutesToMS(minutes) {
    const seconds = minutes * 60;
    return convertSecondsToMS(seconds);
}

function convertSecondsToMS(seconds) {
    return seconds * 1000;
}
