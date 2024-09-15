import { fetchChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';

/**
 * LINE Messaging APIサービスインターフェース
 */
export interface ILineMessagingApiService {
  fetchChannelAccessToken(
    jwt: string,
  ): Promise<fetchChannelAccessTokenResponseDto>;
}
