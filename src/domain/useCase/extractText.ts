import { RESPONSE_MESSAGE_TRIGGER } from 'src/config/constants';

/**
 * Extract prefecture name from received text.
 * @param text received text
 * @return extracted prefecture name
 */
export const extractPrefectureName = (text: string): string | null => {
  const match = text.match(RESPONSE_MESSAGE_TRIGGER.WHERE_YOU_LIVE_REGEX);
  return match ? match[1] : null;
};

/**
 * Extract seismic intensity from received text.
 * @param text received text
 * @return extracted seismic intensity
 */
export const extractSeismicIntensity = (text: string): string | null => {
  const match = text.match(
    RESPONSE_MESSAGE_TRIGGER.QUAKE_SEISMIC_INTENSITY_REGEX,
  );
  return match ? match[1] : null;
};
