export const MESSAGE_TEXT = {
	HELP_DESCRIPTION:
	`
	This bot is used for counting down durations, in minutes, up until one hour.\n
	Only one countdown can be triggered by a user at a time.\n
	To begin the timer you can type !countdown followed by the number of minutes you wish the countdown to last, up until one hour.\n
	Example: <i>!countdown 35</i> to have the duration set for 35 minutes.\n
	The clock will countdown and post a message every minute until the duration has ended.\n.
	To end the countdown early you can type <i>!stop</i>.
	`,
	NO_COMMAND_FOUND: 'That command is not supported current :(',
	UNKNOWN_ERROR: 'Oops! Unknowned error occurred sorry.',
	TIMER_STARTED: 'Countdown begun with %t minutes left.',
	TIMER_CLEARED: 'Countdown ended.',
	TIMER_NOT_FOUND: 'Oops, no countdown was found for you.',
	TIMER_ENDED: 'The countdown has ended.',
	TIMER_MINUTE_REMAINING: 'There is 1 minute remaining in the countdown.',
	TIMER_MINUTES_REMAINING: 'There are %t minutes remaining in the countdown.',
	NUMBER_REQUIRED:
		'A number is required as one of the parameters for this command.',
	TIMER_TOO_LARGE:
		'The maximum duration supported by this command is %max minutes. %time was provided, please use %max minutes or less.',
	TIMER_ALREADY_EXISTS:
		'A countdown for this user is already being handled, please use !stop command to stop the previous countdown or wait for the previous command to finish.',
};
