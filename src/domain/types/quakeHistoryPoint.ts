/**
 * Information of seismic observation points grouped by prefecture.
 */
export type PointsGroupedByPrefecture = {
  [pref: string]: [string, string, number][];
};
