import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { P2P_GET_QUAKE_HISTORY_CODE } from 'src/config/constants';
import { IQuakeBatchJob } from 'src/domain/interfaces/jobs/quakeBatchJob';
import { QuakeService } from '../services/quakeService';

// Log message constants
const LOG_MESSAGES = {
  START_PROCESS_QUAKE_HISTORY_BATCH: 'Start process quake history batch.',
  PROCESS_QUAKE_HISTORY_BATCH_SUCCESS:
    'Successfully process quake history batch.',
  PROCESS_QUAKE_HISTORY_BATCH_FAILED: 'Failed to Process quake history batch.',
};

/**
 * Quake batch job
 */
@Injectable()
export class QuakeBatchJob implements IQuakeBatchJob {
  private readonly logger = new Logger(QuakeBatchJob.name);

  constructor(private readonly quakeService: QuakeService) {}

  /**
   * Batch process to fetch, save, and notify quake history.
   */
  // @Cron(CronExpression.EVERY_5_SECONDS)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processQuakeHistoryBatch(): Promise<void> {
    //TODO 後で消す
    const startTime = performance.now();

    this.logger.log(LOG_MESSAGES.START_PROCESS_QUAKE_HISTORY_BATCH);
    const codes = P2P_GET_QUAKE_HISTORY_CODE; // fixed argument
    const limit = 3; // fixed argument
    const offset = 0; // fixed argument

    try {
      await this.quakeService.processQuakeHistory(codes, limit, offset);
      this.logger.log(LOG_MESSAGES.PROCESS_QUAKE_HISTORY_BATCH_SUCCESS);

      //TODO 後で消す
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.logger.log(
        `processQuakeHistoryBatch took ${duration} milliseconds.`,
      );
    } catch (err) {
      this.logger.error(
        LOG_MESSAGES.PROCESS_QUAKE_HISTORY_BATCH_FAILED,
        err.stack,
      );
      throw err;
    }
  }
}
