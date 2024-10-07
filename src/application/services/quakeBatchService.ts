import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QuakeService } from './quakeService';
import { P2P_GET_QUAKE_HISTORY_CODE } from 'src/config/constants';
import { IQuakeBatchService } from 'src/domain/interfaces/services/quakeBatchService';

// Log message constants
const LOG_MESSAGES = {
  START_PROCESS_QUAKE_HISTORY_BATCH: 'Start process quake history batch.',
  PROCESS_QUAKE_HISTORY_BATCH_SUCCESS:
    'Process quake history batch successfully.',
  PROCESS_QUAKE_HISTORY_BATCH_FAILED: 'Process quake history batch failed.',
};

/**
 * Quake batch service
 */
@Injectable()
export class QuakeBatchService implements IQuakeBatchService {
  private readonly logger = new Logger(QuakeBatchService.name);

  constructor(private readonly quakeService: QuakeService) {}

  /**
   * Batch process to fetch, save, and notify quake history.
   */
  // @Cron(CronExpression.EVERY_5_SECONDS)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processQuakeHistoryBatch(): Promise<void> {
    const startTime = performance.now();

    this.logger.log(LOG_MESSAGES.START_PROCESS_QUAKE_HISTORY_BATCH);
    const codes = P2P_GET_QUAKE_HISTORY_CODE; // fixed argument
    const limit = 3; // fixed argument
    const offset = 0; // fixed argument

    try {
      await this.quakeService.processQuakeHistory(codes, limit, offset);
      this.logger.log(LOG_MESSAGES.PROCESS_QUAKE_HISTORY_BATCH_SUCCESS);

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
