// export const QUAKE_HISTORY_VALID_TIME = 60 * 3; // 3 minutes
export const QUAKE_HISTORY_VALID_TIME = 60 * 60 * 24 * 7; // 7 days
export const QUAKE_ID_VALID_TIME = 60 * 5; // 5 minutes

export const CHANNEL_ACCESS_TOKEN_VALID_TIME = 60 * 60 * 24 * 3; // 3 days
export const JWT_EXPIRATION_TIME = 60 * 60 * 24 * 30; // 30 days

export const P2P_GET_QUAKE_HISTORY_URL = 'https://api.p2pquake.net/v2/history';
export const P2P_GET_QUAKE_HISTORY_CODE = 551;

export const LINE_API_BASE_URL = 'https://api.line.me/';
export const LINE_API_OAUTH_TOKEN_URL = 'https://api.line.me/oauth2/v2.1/token';
export const LINE_API_OAUTH_VERIFY_URL =
  'https://api.line.me/oauth2/v2.1/verify';
export const LINE_API_GET_USER_PROFILE_URL =
  'https://api.line.me/v2/bot/profile/';
export const LINE_API_PUSH_MESSAGE_URL =
  'https://api.line.me/v2/bot/message/push';

export const QUAKE_HISTORY_TABLE_NAME = 'QuakeHistory';
export const CHANNEL_ACCESS_TOKEN_TABLE_NAME = 'ChannelAccessToken';
export const USERS_TABLE_NAME = 'Users';

export const RESPONSE_MESSAGE_TRIGGER = {
  WHERE_YOU_LIVE: '現在の住んでいる場所を変更したい。',
  QUAKE_SEISMIC_INTENSITY: '通知する地震の震度を変更したい。',
  CONTACT_ME_BY_CHAT: 'チャットで問い合わせます。',
};
