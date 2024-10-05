/**
 * Channel access token service interface
 */
export interface IChannelAccessTokenService {
  processChannelAccessToken(): Promise<void>;
  getLatestChannelAccessToken(): Promise<string>;
}
