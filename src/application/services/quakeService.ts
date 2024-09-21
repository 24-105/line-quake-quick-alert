import { Injectable, Logger } from '@nestjs/common';
import { P2pQuakeApiService } from 'src/infrastructure/api/p2pQuake/p2pQuakeApiService';
import { fetchP2pQuakeHistoryResponseDto } from '../dto/p2pQuakeHistoryDto';
import { IQuakeService } from 'src/domain/interfaces/services/quakeService';
import { Cron, CronExpression } from '@nestjs/schedule';
import { convertToUnixTime, getJstTime } from 'src/domain/useCase/dateUseCase';
import { QUAKE_HISTORY_VALID_TIME } from 'src/config/constants';
import { QuakeHistoryRepository } from 'src/infrastructure/persistence/repositories/quakeHistoryRepository';

// Log message constants
const START_FETCH_QUAKE_HISTORY_BATCH_LOG = 'Start fetch quake history batch.';
const REQUEST_FETCH_QUAKE_HISTORY_LOG = 'Requesting fetch quake history.';
const HISTORY_NOT_FOUND_LOG = 'No quake history found.';
const VERIFY_EVENT_TIME_SUCCESS_LOG = 'Event time is successfully verified.';

/**
 * Quake service
 */
@Injectable()
export class QuakeService implements IQuakeService {
  private readonly logger = new Logger(QuakeService.name);

  constructor(
    private readonly p2pQuakeApiService: P2pQuakeApiService,
    private readonly quakeHistoryRepository: QuakeHistoryRepository,
  ) {}

  /**
   * Batch to fetch quake history.
   * @param codes quake history code
   * @param limit Number of returned items
   * @param offset Number of items to skip
   * @returns P2P地震情報 API quake history response Dto
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async fetchQuakeHistoryBatch(): Promise<fetchP2pQuakeHistoryResponseDto[]> {
    this.logger.log(START_FETCH_QUAKE_HISTORY_BATCH_LOG);
    const codes = 551; // fixed argument
    const limit = 1; // fixed argument
    const offset = 0; // fixed argument
    return this.fetchQuakeHistory(codes, limit, offset);
  }

  /**
   * Fetch quake history.
   * @param codes quake history code
   * @param limit Number of returned items
   * @param offset Number of items to skip
   * @returns P2P地震情報 API quake history response Dto
   */
  async fetchQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<fetchP2pQuakeHistoryResponseDto[]> {
    this.logger.log(REQUEST_FETCH_QUAKE_HISTORY_LOG);

    // Fetch quake history from P2P 地震情報 API.
    const quakeHistory = await this.p2pQuakeApiService.fetchP2pQuakeHistory(
      codes,
      limit,
      offset,
    );

    // If quake information could not be fetched.
    if (quakeHistory.length === 0) {
      throw new Error(HISTORY_NOT_FOUND_LOG);
    }

    // Get current time and convert it to UnixTime.
    const jstTimeNow = getJstTime();
    const unixTimeNow = convertToUnixTime(jstTimeNow);

    for (const history of quakeHistory) {
      // Verify quake event time.
      this.logger.log(`Event time is ${history.earthquake.time} verify start.`);
      if (await this.verifyEventTime(unixTimeNow, history.earthquake.time)) {
        continue;
      }

      // Check if the quake ID exists in the table.
      this.logger.log(`Quake ID ${history.id} check start.`);
      const idExists = await this.quakeHistoryRepository.checkIfQuakeIDExists(
        history.id,
      );
      if (idExists) {
        continue;
      }
    }

    return quakeHistory;
  }

  /**
   * Check if the quake  event time meets the threshold.
   * @param unixTimeNow current time in UnixTime
   * @param eventTime quake event time
   * @returns true: event time is over the threshold, false: event time is within the threshold
   */
  private async verifyEventTime(
    unixTimeNow: number,
    eventTime: string,
  ): Promise<boolean> {
    const unixEventTime = convertToUnixTime(eventTime);
    if (unixTimeNow - unixEventTime >= QUAKE_HISTORY_VALID_TIME) {
      this.logger.log(
        `Event time is over ${QUAKE_HISTORY_VALID_TIME} seconds ago.`,
      );
      return true;
    }

    this.logger.log(VERIFY_EVENT_TIME_SUCCESS_LOG);
    return false;
  }
}
