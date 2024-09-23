import { Controller, Get, Logger } from '@nestjs/common';
import { ChannelAccessTokenService } from 'src/application/services/channelAccessTokenService';

// Log message constants
const LOG_MESSAGES = {
  REQUEST_PROCESS_CHANNEL_ACCESS_TOKEN:
    'Requesting process channel access token.',
  PROCESS_CHANNEL_ACCESS_TOKEN_SUCCESS:
    'Channel access token successfully processed.',
  PROCESS_CHANNEL_ACCESS_TOKEN_FAILED:
    'Failed to process channel access token.',
};

/**
 * LINE authentication controller
 */
@Controller('api/v1/line/auth')
export class LineAuthController {
  private readonly logger = new Logger(LineAuthController.name);

  constructor(readonly channelAccessTokenService: ChannelAccessTokenService) {}

  /**
   * Process channel access token.
   */
  @Get('channelAccessToken')
  async processChannelAccessToken(): Promise<void> {
    this.logger.log(LOG_MESSAGES.REQUEST_PROCESS_CHANNEL_ACCESS_TOKEN);

    try {
      await this.channelAccessTokenService.processChannelAccessToken();
      this.logger.log(LOG_MESSAGES.PROCESS_CHANNEL_ACCESS_TOKEN_SUCCESS);
    } catch (err) {
      this.logger.error(
        LOG_MESSAGES.PROCESS_CHANNEL_ACCESS_TOKEN_FAILED,
        err.stack,
      );
      throw err;
    }
  }
}
