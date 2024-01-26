// import config from './config.json' assert { type: 'json' };
import dotenv from 'dotenv';
import { handleResponse } from './services/response.js';
import { MESSAGE_TEXT } from './constants/messages.js';
import { getDiscordClient, replyToMessage } from './services/discordClient.js';
dotenv.config({ silent: process.env.NODE_ENV === 'production' });
const client = getDiscordClient();
const COMMAND = /^!\w+/;

(async () => {
    await client.login(process.env.TOKEN);

    client.on('messageCreate', (msg) => {
        try {
            if (
                !msg.content.match(COMMAND) ||
                msg.author.id === client.user.id
            ) {
                return;
            }
            const response = handleResponse(msg);
            if (!response) {
                return;
            }
            replyToMessage(msg, response);
        } catch (error) {
            replyToMessage(msg, MESSAGE_TEXT.UNKNOWN_ERROR);
            console.error({
                message: 'UNKOWN ERROR',
                errorMessage: error.message,
                errorStack: error.stack,
            });
        }
    });
})();
