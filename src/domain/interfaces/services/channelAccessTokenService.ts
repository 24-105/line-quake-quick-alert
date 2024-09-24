/**
 * Channel access token service interface
 */
export interface IChannelAccessTokenService {
  processChannelAccessToken(): Promise<void>;
  getChannelAccessToken(): Promise<string>;
}
