import { SeismicIntensityScale } from '../enum/common/seismicIntensity';

/**
 * Convert seismicIntensity scale to corresponding enum value.
 * @param seismicIntensity seismicIntensity scale
 * @returns corresponding enum value or null if not found
 */
export const convertSeismicIntensityEnum = (
  seismicIntensity: string,
): number | null => {
  const seismicIntensityEnum =
    SeismicIntensityScale[
      seismicIntensity as keyof typeof SeismicIntensityScale
    ];
  return seismicIntensityEnum !== undefined ? seismicIntensityEnum : null;
};
