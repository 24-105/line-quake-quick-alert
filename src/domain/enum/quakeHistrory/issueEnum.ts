/**
 * SCALE_PROMPT: ScalePrompt(震度速報)
 * Destination: Destination(震源に関する情報)
 * DETAILSCALE: DetailScale(各地の震度に関する情報)
 * FOREIGN: Foreign(遠地地震に関する情報)
 * OTHER: Other(その他の情報)
 */
export enum IssueType {
  SCALE_PROMPT = 'ScalePrompt',
  Destination = 'Destination',
  DETAILSCALE = 'DetailScale',
  FOREIGN = 'Foreign',
  OTHER = 'Other',
}

/**
 * NONE: None(なし)
 * UNKNOWN: Unknown(不明)
 * SCALEONLY: ScaleOnly(震度)
 * DESTINATIONONLY: DestinationOnly(震源)
 * SCALEANDDESTINATION: ScaleAndDestination(震度・震源)
 */
export enum IssueCorrect {
  NONE = 'None',
  UNKNOWN = 'Unknown',
  SCALEONLY = 'ScaleOnly',
  DESTINATIONONLY = 'DestinationOnly',
  SCALEANDDESTINATION = 'ScaleAndDestination',
}
