// import config from './config.json' assert { type: 'json' };
import dotenv from 'dotenv';
import {
    Client,
    GatewayIntentBits,
    IntentsBitField,
    Partials,
} from 'discord.js';
import { handleResponse } from './services/response.js';
import { MESSAGE_TEXT } from './constants/messages.js';
dotenv.config({ silent: process.env.NODE_ENV === 'production' });
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

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
            msg.reply(response);
        } catch (error) {
            msg.reply(MESSAGE_TEXT.UNKNOWN_ERROR);
            console.error({
                message: 'UNKOWN ERROR',
                errorMessage: error.message,
                errorStack: error.stack,
            });
        }
    });
})();
