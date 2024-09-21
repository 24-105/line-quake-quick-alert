import { format, toZonedTime } from 'date-fns-tz';
import { parse } from 'date-fns';

/**
 * Get the current time in JST time.
 * @returns JST time(yyyy/MM/dd HH:mm:ss)
 */
export const getJstTime = (): string => {
  const currentUtcTime = new Date();
  const currentJstTime = toZonedTime(currentUtcTime, 'Asia/Tokyo');
  return format(currentJstTime, 'yyyy/MM/dd HH:mm:ss', {
    timeZone: 'Asia/Tokyo',
  });
};

/**
 * Convert string time to UnixTime.
 * @param dateString string time(yyyy/MM/dd HH:mm:ss)
 * @returns UnixTime
 */
export const convertToUnixTime = (dateString: string): number => {
  const date = parse(dateString, 'yyyy/MM/dd HH:mm:ss', new Date());
  return date.getTime() / 1000;
};
