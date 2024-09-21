import { Injectable, Logger } from '@nestjs/common';
import { fetchChannelAccessTokenResponseDto } from '../dto/channelAccessTokenDto';
import { LineMessagingApiService } from 'src/infrastructure/api/line/lineMessagingApiService';
import { IChannelAccessTokenService } from 'src/domain/interfaces/services/channelAccessTokenService';
import { ChannelAccessTokenRepository } from 'src/infrastructure/persistence/repositories/channelAccessTokenRepository';
import { generateJwt } from 'src/domain/useCase/jwt';

// Log message constants
const REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_LOG =
  'Requesting fetch channel access token.';
const GENERATE_JWT_LOG = 'Trying to generate JWT.';
const GENERATE_JWT_FAILED_LOG = 'Failed to generate JWT.';
const FETCH_CHANNEL_ACCESS_TOKEN_LOG = 'Trying to fetch channel access token.';
const FETCH_CHANNEL_ACCESS_TOKEN_FAILED_LOG =
  'Failed to fetch channel access token.';
const UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_SUCCESS_LOG =
  'Successfully updated channel access token.';
const UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_FAILED_LOG =
  'Failed to update channel access token.';

/**
 * Channel access token service
 */
@Injectable()
export class ChannelAccessTokenService implements IChannelAccessTokenService {
  private readonly logger = new Logger(ChannelAccessTokenService.name);

  constructor(
    private readonly lineMessagingApiService: LineMessagingApiService,
    private readonly channelAccessTokenRepository: ChannelAccessTokenRepository,
  ) {}

  /**
   * Fetch channel access token.
   * @returns channel access token
   */
  async fetchChannelAccessToken(): Promise<void> {
    this.logger.log(REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_LOG);
    try {
      let jwt: string;
      try {
        this.logger.log(GENERATE_JWT_LOG);
        jwt = await generateJwt();
      } catch (err) {
        this.logger.error(GENERATE_JWT_FAILED_LOG, err.stack);
        throw err;
      }

      const tokenResponse = await this.fetchChannelAccessTokenWithJwt(jwt);
      this.logger.log(FETCH_CHANNEL_ACCESS_TOKEN_LOG);

      await this.channelAccessTokenRepository.putChannelAccessToken(
        tokenResponse.access_token,
        tokenResponse.key_id,
      );
      this.logger.log(UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_SUCCESS_LOG);
    } catch (err) {
      this.logger.error(
        UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_FAILED_LOG,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Fetch channel access token using JWT.
   * @param jwt JWT
   * @returns channel access token
   */
  private async fetchChannelAccessTokenWithJwt(
    jwt: string,
  ): Promise<fetchChannelAccessTokenResponseDto> {
    try {
      return await this.lineMessagingApiService.fetchChannelAccessToken(jwt);
    } catch (err) {
      this.logger.error(FETCH_CHANNEL_ACCESS_TOKEN_FAILED_LOG, err.stack);
      throw err;
    }
  }
}
