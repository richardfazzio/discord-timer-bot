import { MESSAGE_TEXT } from '../constants/messages.js';

const timers = new Map(); // Ongoing timers in memory
// Takes in string msg and returns a response

//https://discord.com/api/oauth2/authorize?client_id=1091817482697850959&permissions=68608&scope=bot

const ACTIONS_REGEX = {
	START_TIMER: /^!countdown\s\d*$/,
	STOP_TIMER: /^!stop$/,
	HELP: /^!help$/
};

const REGEX = {
	WHITE_SPACE: /\s+/,
};

const MAX_TIMER = 60; // Time in minutes

export function handleResponse(msg) {
	if (msg.content.match(ACTIONS_REGEX.HELP)) {
		return MESSAGE_TEXT.HELP_DESCRIPTION
	}
	if (msg.content.match(ACTIONS_REGEX.START_TIMER)) {
		return handleStartTimer(msg);
	}
	if (msg.content.match(ACTIONS_REGEX.STOP_TIMER)) {
		return handleStopTimer(msg);
	}
}

function handleStartTimer(msg) {
	const { content, author } = msg;
	const [_, minutesString] = content.split(REGEX.WHITE_SPACE);
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
	msg.reply(MESSAGE_TEXT.TIMER_STARTED.replace('%t', minutes));
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
		msg.reply(MESSAGE_TEXT.TIMER_ENDED);
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
	msg.reply(reply);
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
	msg.reply(MESSAGE_TEXT.TIMER_ENDED);
}

// function getEndTimeInMS(createdTimestamp, timerMinutes) {
// 	return createdTimestamp + convertMinutesToMS(timerMinutes);
// }

function convertMinutesToMS(minutes) {
	const seconds = minutes * 60;
	return convertSecondsToMS(seconds);
}

function convertSecondsToMS(seconds) {
	return seconds * 1000;
}

// function convertMSToMinutes(ms) {
// 	return Math.floor(ms / 60 / 1000);
// }

// function defaultResponse() {
// 	return MESSAGE_TEXT.NO_COMMAND_FOUND;
// }
