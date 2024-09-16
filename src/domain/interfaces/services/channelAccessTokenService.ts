import { fetchChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';

/**
 * チャンネルアクセストークンサービスインターフェース
 */
export interface IChannelAccessTokenService {
  fetchChannelAccessToken(): Promise<fetchChannelAccessTokenResponseDto>;
}
