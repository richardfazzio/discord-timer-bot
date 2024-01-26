import { Client, IntentsBitField, Partials } from 'discord.js';

let discordClient = null;

export function getDiscordClient() {
    if (!discordClient) {
        discordClient = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
            ],
            partials: [Partials.Channel, Partials.Message, Partials.Reaction],
        });
    }
    return discordClient;
}

export function sendMessageByChannelId(channelId, content) {
    if (!discordClient) {
        throw new Error('No client found');
    }
    discordClient.channels.cache.get(channelId).send(content);
}

export function replyToMessage(msg, content) {
    if (!discordClient) {
        throw new Error('No client found');
    }
    msg.reply(content);
}
