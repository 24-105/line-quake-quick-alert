import { Prefecture } from '../enum/common/prefecture';

/**
 * Convert prefecture name to corresponding enum value.
 * @param prefectureName prefecture name
 * @returns corresponding enum value or null if not found
 */
export const convertPrefectureToNumber = (
  prefectureName: string,
): number | null => {
  const prefectureEnum = Prefecture[prefectureName as keyof typeof Prefecture];
  return prefectureEnum !== undefined ? prefectureEnum : null;
};

/**
 * Convert prefecture enum value to corresponding name.
 * @param prefectureEnum prefecture enum value
 * @returns corresponding name or null if not found
 */
export const convertPrefectureToString = (
  prefectureEnum: number,
): string | null => {
  const prefectureName = Prefecture[prefectureEnum];
  return prefectureName !== undefined ? prefectureName : null;
};
