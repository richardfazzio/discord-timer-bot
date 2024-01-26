import { MESSAGE_TEXT } from '../constants/messages.js';
import { END_COMBAT, ROUND_COMBAT, START_COMBAT } from '../constants/regex.js';
import { replyToMessage, sendMessageByChannelId } from './discordClient.js';
import { rollDice } from './rollDice.js';

const combatTracker = {};

const replaceLoadRegex = /^!combat\s+load\s+/gi;
const initBonusRegex = /\+|-/;

const DEFAULT_INITIATIVE = 0;

export function handleCombatInitiative(msg) {
    const { content } = msg;
    if (content.match(START_COMBAT)) {
        handleStartCombat(msg);
        return;
    }
    if (content.match(END_COMBAT)) {
        handleEndCombat(msg);
        return;
    }
    if (content.match(ROUND_COMBAT)) {
        handleCombatRound(msg);
        return;
    }
    replyToMessage(
        msg,
        'Command does not match anything for **!combat** sorry!'
    );
}

function handleCombatRound(msg) {
    const { author, channelId } = msg;
    const players = combatTracker[author.id];
    if (!players || !players.length) {
        return handleNoCombatCommand(msg);
    }
    const response = players
        .map(handleIntiativeRolls)
        .sort(handleSortPlayerOnRolls)
        .map(handleMapPlayerToRollString)
        .join('');
    sendMessageByChannelId(channelId, response);
}

function handleEndCombat(msg) {
    const { author } = msg;
    if (!combatTracker[author.id]) {
        return handleNoCombatCommand(msg);
    }
    delete combatTracker[author.id];
    replyToMessage(msg, 'Combat ended...');
}

function handleStartCombat(msg) {
    const { content, author } = msg;
    // Return session error (already exists)
    if (combatTracker[author.id]) {
        return replyToMessage(
            msg,
            'Combat already exists for you, please end combat before starting again'
        );
    }
    try {
        const combatStartCommand = content.replace(replaceLoadRegex, '');
        const players = combatStartCommand.split(',').filter((s) => s);
        if (!players.length) {
            return replyToMessage(msg, 'No players found to set initiatives');
        }
        const initiatives = players.map((player) => {
            const [playerName, bonus] = player.split(initBonusRegex);
            // player has no bonus
            if (!bonus) {
                return { playerName: player, initiative: DEFAULT_INITIATIVE };
            }
            const isPos = player.includes('+') ? 1 : -1;
            return { playerName, initiative: +bonus * isPos };
        });
        combatTracker[author.id] = initiatives;
        replyToMessage(msg, 'Initiatives Set');
    } catch (error) {
        console.error(error);
        replyToMessage(msg, MESSAGE_TEXT.UNKNOWN_ERROR);
    }
}

function handleNoCombatCommand(msg) {
    replyToMessage(
        msg,
        'There is no combat for you, please start a combat before trying to end one :)'
    );
}

function handleIntiativeRolls(player) {
    const roll = rollDice() + player.initiative;
    return {
        roll,
        playerName: player.playerName,
        initiative: player.initiative,
    };
}

function handleSortPlayerOnRolls(playerA, playerB) {
    if (playerA.roll === playerB.roll) {
        return playerA.initiative < playerB.initiative ? 1 : -1;
    }
    return playerA.roll < playerB.roll ? 1 : -1;
}

function handleMapPlayerToRollString(player, index) {
    return `${index + 1}. ${player.playerName}: **${player.roll}**.\n`;
}
