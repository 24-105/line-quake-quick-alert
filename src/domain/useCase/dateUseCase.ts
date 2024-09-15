import { format, toZonedTime } from 'date-fns-tz';
import { parse } from 'date-fns';

/**
 * 現在のJST時間を取得する
 * @returns JST時間(yyyy/MM/dd HH:mm:ss)
 */
export const getJstTime = (): string => {
  const currentUtcTime = new Date();
  const currentJstTime = toZonedTime(currentUtcTime, 'Asia/Tokyo');
  return format(currentJstTime, 'yyyy/MM/dd HH:mm:ss', {
    timeZone: 'Asia/Tokyo',
  });
};

/**
 * 文字列の時間をUnixTimeに変換する
 * @param dateString 文字列の時間(yyyy/MM/dd HH:mm:ss)
 * @returns UnixTime
 */
export const convertToUnixTime = (dateString: string): number => {
  const date = parse(dateString, 'yyyy/MM/dd HH:mm:ss', new Date());
  return date.getTime() / 1000;
};
