import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IChannelAccessTokenBatchService } from 'src/domain/interfaces/services/channelAccessTokenBatchService';
import { ChannelAccessTokenService } from './channelAccessTokenService';

// Log message constants
const START_UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_LOG =
  'Start update channel access token batch.';
const UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_SUCCESS_LOG =
  'Successfully updated channel access token.';
const UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_FAILED_LOG =
  'Failed to update channel access token.';

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
   * Batch to update channel access token.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateChannelAccessTokenBatch(): Promise<void> {
    this.logger.log(START_UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_LOG);

    try {
      this.channelAccessTokenService.fetchChannelAccessToken();
      this.logger.log(UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_SUCCESS_LOG);
    } catch (err) {
      this.logger.log(UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_FAILED_LOG);
      throw err;
    }
  }
}
