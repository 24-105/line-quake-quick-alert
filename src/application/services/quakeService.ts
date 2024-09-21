import { Injectable, Logger } from '@nestjs/common';
import { P2pQuakeApiService } from 'src/infrastructure/api/p2pQuake/p2pQuakeApiService';
import { fetchP2pQuakeHistoryResponseDto } from '../dto/p2pQuakeHistoryDto';
import { IQuakeService } from 'src/domain/interfaces/services/quakeService';
import { convertToUnixTime, getJstTime } from 'src/domain/useCase/date';
import { QUAKE_HISTORY_VALID_TIME } from 'src/config/constants';
import { QuakeHistoryRepository } from 'src/infrastructure/persistence/repositories/quakeHistoryRepository';
import { verifyEventTime } from 'src/domain/useCase/quakeEventTime';

// Log message constants
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
      if (await verifyEventTime(unixTimeNow, history.earthquake.time)) {
        this.logger.log(
          `Event time is over ${QUAKE_HISTORY_VALID_TIME} seconds ago.`,
        );
        continue;
      }
      this.logger.log(VERIFY_EVENT_TIME_SUCCESS_LOG);

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
}
