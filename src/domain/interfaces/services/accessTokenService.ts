import { getChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';

/**
 * アクセストークンサービスインターフェース
 */
export interface IAccessTokenService {
  generateJwt(): Promise<string>;
  getChannelAccessToken(jwt: string): Promise<getChannelAccessTokenResponseDto>;
}
