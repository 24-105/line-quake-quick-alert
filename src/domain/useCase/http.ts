/**
 * Create headers for the request.
 * @returns Headers object
 */
export const createEncodeHeaders = () => {
  return { 'Content-Type': 'application/x-www-form-urlencoded' };
};

/**
 * Create headers for the request.
 * @returns Headers object
 */
export const createHeaders = (): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
  };
};

/**
 * Create headers object with channel access token
 * @param channelAccessToken Channel access token
 * @returns Headers object
 */
export const createAuthHeaders = (
  channelAccessToken: string,
): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${channelAccessToken}`,
  };
};
