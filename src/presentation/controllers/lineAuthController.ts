import { Controller, Get, Logger } from '@nestjs/common';
import { ChannelAccessTokenService } from 'src/application/services/channelAccessTokenService';

// Log message constants
const REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_LOG =
  'Requesting fetch channel access token.';
const FETCH_CHANNEL_ACCESS_TOKEN_SUCCESS_LOG =
  'Channel access token successfully fetched.';
const REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_FAILED_LOG =
  'Failed to fetch channel access token.';

/**
 * LINE authentication controller
 */
@Controller('api/v1/line/auth')
export class LineAuthController {
  private readonly logger = new Logger(LineAuthController.name);

  constructor(readonly channelAccessTokenService: ChannelAccessTokenService) {}

  /**
   * Fetch channel access token.
   * @returns channel access token
   */
  @Get('channelAccessToken')
  async fetchChannelAccessToken(): Promise<void> {
    this.logger.log(REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_LOG);

    try {
      await this.channelAccessTokenService.fetchChannelAccessToken();
      this.logger.log(FETCH_CHANNEL_ACCESS_TOKEN_SUCCESS_LOG);
    } catch (err) {
      this.logger.error(
        REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_FAILED_LOG,
        err.stack,
      );
      throw err;
    }
  }
}
