import { fetchChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';

/**
 * Channel access token service interface
 */
export interface IChannelAccessTokenService {
  fetchChannelAccessToken(): Promise<fetchChannelAccessTokenResponseDto>;
}
