/**
 * Channel access token service interface
 */
export interface IChannelAccessTokenService {
  fetchChannelAccessToken(): Promise<void>;
}
