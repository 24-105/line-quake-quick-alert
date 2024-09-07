/**
 * NONE: None(なし)
 * UNKNOWN: Unknown(不明)
 * CHECKING: Checking(調査中)
 * NONEFFECTIVE: NonEffective(若干の海面変動が予想されるが、被害の心配なし)
 * WATCH: Watch(津波注意報)
 * WARNING: Warning(津波予報(種類不明)
 */
export enum EarthquakeDomesticTsunami {
  NONE = 'None',
  UNKNOWN = 'Unknown',
  CHECKING = 'Checking',
  NONEFFECTIVE = 'NonEffective',
  WATCH = 'Watch',
  WARNING = 'Warning',
}

/**
 * NONE: None(なし)
 * UNKNOWN: Unknown(不明)
 * CHECKING: Checking(調査中)
 * NONEFFECTIVENEARBY: NonEffectiveNearby(震源の近傍で小さな津波の可能性があるが、被害の心配なし)
 * WARNINGNEARBY: WarningNearby(震源の近傍で津波の可能性がある)
 * WARNINGPACIFIC: WarningPacific(太平洋で津波の可能性がある)
 * WARNINGPACIFICWIDE: WarningPacificWide(太平洋の広域で津波の可能性がある)
 * WARNINGINDIAN: WarningIndian(インド洋で津波の可能性がある)
 * WARNINGINDIANWIDE: WarningIndianWide(インド洋の広域で津波の可能性がある)
 * POTENTIAL: Potential(一般にこの規模では津波の可能性がある)
 */
export enum EarthquakeForeignTsunami {
  NONE = 'None',
  UNKNOWN = 'Unknown',
  CHECKING = 'Checking',
  NONEFFECTIVENEARBY = 'NonEffectiveNearby',
  WARNINGNEARBY = 'WarningNearby',
  WARNINGPACIFIC = 'WarningPacific',
  WARNINGPACIFICWIDE = 'WarningPacificWide',
  WARNINGINDIAN = 'WarningIndian',
  WARNINGINDIANWIDE = 'WarningIndianWide',
  POTENTIAL = 'Potential',
}
