import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IChannelAccessTokenBatchService } from 'src/domain/interfaces/services/channelAccessTokenBatchService';
import { ChannelAccessTokenService } from './channelAccessTokenService';

// Log message constants
const LOG_MESSAGES = {
  START_PROCESS_CHANNEL_ACCESS_TOKEN_BATCH:
    'Start process channel access token batch.',
  PROCESS_CHANNEL_ACCESS_TOKEN_BATCH_SUCCESS:
    'Successfully processed channel access token.',
  PROCESS_CHANNEL_ACCESS_TOKEN_BATCH_FAILED:
    'Failed to process channel access token.',
};

/**
 * Channel access token batch service
 */
@Injectable()
export class ChannelAccessTokenBatchService
  implements IChannelAccessTokenBatchService
{
  private readonly logger = new Logger(ChannelAccessTokenBatchService.name);

  constructor(
    private readonly channelAccessTokenService: ChannelAccessTokenService,
  ) {}

  /**
   * Batch process to fetch and update channel access token.
   */
  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processChannelAccessTokenBatch(): Promise<void> {
    this.logger.log(LOG_MESSAGES.START_PROCESS_CHANNEL_ACCESS_TOKEN_BATCH);

    try {
      await this.channelAccessTokenService.processChannelAccessToken();
      this.logger.log(LOG_MESSAGES.PROCESS_CHANNEL_ACCESS_TOKEN_BATCH_SUCCESS);
    } catch (err) {
      this.logger.log(LOG_MESSAGES.PROCESS_CHANNEL_ACCESS_TOKEN_BATCH_FAILED);
      throw err;
    }
  }
}
