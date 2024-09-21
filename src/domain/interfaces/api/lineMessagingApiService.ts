import { fetchChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';

/**
 * LINE Messaging API service interface
 */
export interface ILineMessagingApiService {
  fetchChannelAccessToken(
    jwt: string,
  ): Promise<fetchChannelAccessTokenResponseDto>;
}
