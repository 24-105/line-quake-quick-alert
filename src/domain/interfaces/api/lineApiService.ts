import { getChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';

/**
 * LINE Messaging APIサービスインターフェース
 */
export interface ILineMessagingApiService {
  getChannelAccessToken(jwt: string): Promise<getChannelAccessTokenResponseDto>;
}
