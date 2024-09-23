/**
 * Check if the request body is valid.
 * @param destination official LINE user id
 * @returns true: valid, false: invalid
 */
export const isMatchingDestination = (destination: string): boolean => {
  return destination === process.env.LINE_QUALE_QUICK_ALERT_USER_ID;
};
