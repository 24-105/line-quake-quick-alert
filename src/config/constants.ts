// export const QUAKE_HISTORY_VALID_TIME = 60 * 3; // 3 minutes
export const QUAKE_HISTORY_VALID_TIME = 60 * 60 * 24 * 7; // 7 days
export const QUAKE_ID_VALID_TIME = 60 * 5; // 5 minutes

export const CHANNEL_ACCESS_TOKEN_VALID_TIME = 60 * 60 * 24 * 3; // 3 days
export const JWT_EXPIRATION_TIME = 60 * 60 * 24 * 30; // 30 days

export const P2P_GET_QUAKE_HISTORY_URL = 'https://api.p2pquake.net/v2/history';
export const P2P_GET_QUAKE_HISTORY_CODE = 551;

export const QUAKE_HISTORY_TABLE_NAME = 'QuakeHistory';
export const CHANNEL_ACCESS_TOKEN_TABLE_NAME = 'ChannelAccessToken';
export const USERS_TABLE_NAME = 'Users';
