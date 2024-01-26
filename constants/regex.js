// Dice Roll
export const DEFAULT_ROLL = /^!roll\s*$/i;
export const ROLL_REMOVE = /^!roll\s*/i;
export const N_ROLL = /^!roll\s*\d+$/i;
export const D_ROLL = /^!roll\s+\d+d\d+$/i;

// Actions to be handled
export const ACTIONS_REGEX = {
    START_TIMER: /^!countdown\s\d*$/i,
    STOP_TIMER: /^!stop$/i,
    COMBAT_INITIATIVE: /^!combat\s+.*/i,
    ROLL: /^!roll( \d+| \d+d\d+){0,1}$/i,
    HELP: /^!help$/i,
};

// Combat Initiative

// !combat load player1+3,m1-1,m2,
export const START_COMBAT = /^!combat\s+load\s+(\w|\d|,\+|-)+/i;
export const END_COMBAT = /^!combat\s+end.*/i;
export const ROUND_COMBAT = /^!combat\s+round.*/i;

export const WHITE_SPACE = /\s+/;
