import { Injectable, Logger } from '@nestjs/common';
import { P2pQuakeApiService } from 'src/infrastructure/api/p2pQuake/p2pQuakeApiService';
import { IQuakeService } from 'src/domain/interfaces/services/quakeService';
import { convertToUnixTime, getJstTime } from 'src/domain/useCase/date';
import { QuakeHistoryRepository } from 'src/infrastructure/persistence/repositories/quakeHistoryRepository';
import { isEventTimeValid } from 'src/domain/useCase/quakeEventTime';
import { PointsScale } from 'src/domain/enum/quakeHistory/pointsEnum';

// Log message constants
const REQUEST_FETCH_QUAKE_HISTORY_LOG = 'Requesting fetch quake history.';
const HISTORY_NOT_FOUND_LOG = 'No quake history found.';
const PUT_QUAKE_ID_FAILED_LOG = 'Failed to put quakeId.';

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
  ): Promise<void> {
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
      if (await isEventTimeValid(unixTimeNow, history.earthquake.time)) {
        continue;
      }

      // Verify quake scale.
      if (history.earthquake.maxScale < PointsScale.SCALE40) {
        continue;
      }

      // Check if the quake id exists in the table.
      if (await this.quakeHistoryRepository.isQuakeIdExists(history.id)) {
        continue;
      }

      console.log(
        'ここでLINEユーザーの登録情報と比較する処理を入れ、配列に詰める',
      );
      console.log('配列からユーザーを取り出してLINEに通知する処理を入れる');

      try {
        await this.quakeHistoryRepository.putQuakeId(history.id);
      } catch (err) {
        this.logger.error(PUT_QUAKE_ID_FAILED_LOG, err.stack);
        throw err;
      }
    }
  }
}
