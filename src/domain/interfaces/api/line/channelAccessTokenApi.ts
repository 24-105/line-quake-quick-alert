import { fetchChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';

/**
 * LINE Channel access token API interface
 */
export interface IChannelAccessTokenApi {
  fetchChannelAccessToken(
    jwt: string,
  ): Promise<fetchChannelAccessTokenResponseDto>;
  verifyChannelAccessToken(channelAccessToken: string): Promise<boolean>;
}
