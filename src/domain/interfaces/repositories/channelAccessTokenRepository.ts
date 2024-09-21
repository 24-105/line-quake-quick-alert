/**
 * Channel access token repository interface
 */
export interface IChannelAccessTokenRepository {
  putChannelAccessToken(
    channelAccessToken: string,
    keyId: string,
  ): Promise<void>;
}
