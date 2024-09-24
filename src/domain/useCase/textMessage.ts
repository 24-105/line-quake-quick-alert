import { getJstTime } from './date';

/**
 * Create contact text message.
 * @param displayName User display name
 * @returns Contact message
 */
export const createContactTextMessage = async (displayName: string) => {
  return {
    type: 'text',
    text: `${getJstTime()}に ${displayName} 様からお問い合わせがありました。`,
  };
};
