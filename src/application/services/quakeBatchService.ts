import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QuakeService } from './quakeService';
import { P2P_GET_QUAKE_HISTORY_CODE } from 'src/config/constants';
import { IQuakeBatchService } from 'src/domain/interfaces/services/quakeBatchService';

// Log message constants
const START_FETCH_QUAKE_HISTORY_BATCH_LOG = 'Start fetch quake history batch.';
const FETCH_QUAKE_HISTORY_BATCH_SUCCESS_LOG =
  'Fetch quake history batch successfully.';
const FETCH_QUAKE_HISTORY_BATCH_FAILED_LOG =
  'Fetch quake history batch failed.';

/**
 * Quake batch service
 */
@Injectable()
export class QuakeBatchService implements IQuakeBatchService {
  private readonly logger = new Logger(QuakeBatchService.name);

  constructor(private readonly quakeService: QuakeService) {}

  /**
   * Batch to fetch quake history.
   * @param codes quake history code
   * @param limit Number of returned items
   * @param offset Number of items to skip
   * @returns P2P地震情報 API quake history response Dto
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async fetchQuakeHistoryBatch(): Promise<void> {
    this.logger.log(START_FETCH_QUAKE_HISTORY_BATCH_LOG);
    const codes = P2P_GET_QUAKE_HISTORY_CODE; // fixed argument
    const limit = 5; // fixed argument
    const offset = 0; // fixed argument
    try {
      await this.quakeService.fetchQuakeHistory(codes, limit, offset);
      this.logger.log(FETCH_QUAKE_HISTORY_BATCH_SUCCESS_LOG);
    } catch (err) {
      this.logger.error(FETCH_QUAKE_HISTORY_BATCH_FAILED_LOG);
      throw err;
    }
  }
}
