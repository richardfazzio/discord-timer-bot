export const MESSAGE_TEXT = {
	HELP_DESCRIPTION: `This bot is used for counting down durations, in minutes, up until one hour.\nOnly one countdown can be triggered by a user at a time.\nTo begin the timer you can type !countdown followed by the number of minutes you wish the countdown to last, up until one hour.\nExample: _**!countdown 35**_ to have the duration set for 35 minutes.\nThe clock will countdown and post a message every minute until the duration has ended.\nTo end the countdown early you can type _**!stop**_.`,
	ROLL_DESCRIPTION: 'You can also roll dice with the **!roll** command. You may use **!roll**, **!roll 10**, or **!roll 2d20** to have the bot roll for you! If no number is provided, with the first command a d20 is selected; however, if you do provide a number it will rol that dice either once, with the second command, or a number of times equal to the **NdM** command. If the third command is provided the bot will roll a dice **N** times with the dice size of **M**.',
	NO_COMMAND_FOUND: 'That command is not supported current :(',
	UNKNOWN_ERROR: 'Oops! Unknowned error occurred sorry.',
	TIMER_STARTED: 'Countdown begun with %t minutes left.',
	TIMER_CLEARED: 'Countdown ended.',
	TIMER_NOT_FOUND: 'Oops, no countdown was found for you.',
	TIMER_ENDED: 'The countdown has ended.',
	TIMER_MINUTE_REMAINING: 'There is 1 minute remaining in the countdown.',
	TIMER_MINUTES_REMAINING: 'There are %t minutes remaining in the countdown.',
	ROLL_RESPONSE: 'You have rolled a %roll!',
	NUMBER_REQUIRED:
		'A number is required as one of the parameters for this command.',
	TIMER_TOO_LARGE:
		'The maximum duration supported by this command is %max minutes. %time was provided, please use %max minutes or less.',
	TIMER_ALREADY_EXISTS:
		'A countdown for this user is already being handled, please use !stop command to stop the previous countdown or wait for the previous command to finish.',
};
