import { fetchChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';

/**
 * アクセストークンサービスインターフェース
 */
export interface IAccessTokenService {
  generateJwt(): Promise<string>;
  fetchChannelAccessToken(
    jwt: string,
  ): Promise<fetchChannelAccessTokenResponseDto>;
}
