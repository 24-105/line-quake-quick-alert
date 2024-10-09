import { Injectable, Logger } from '@nestjs/common';
import { IQuakeService } from 'src/domain/interfaces/services/quakeService';
import { convertToUnixTime, getJstTime } from 'src/domain/useCase/date';
import { QuakeHistoryRepository } from 'src/infrastructure/repositories/quakeHistoryRepository';
import { isEventTimeValid } from 'src/domain/useCase/quakeEventTime';
import { PointsScale } from 'src/domain/enum/quakeHistory/pointsEnum';
import { P2pQuakeApi } from 'src/infrastructure/api/p2pQuake/p2pQuakeApi';
import { PointsGroupedByPrefecture } from 'src/domain/types/quakeHistoryPoint';
import { UserService } from './userService';
import { fetchP2pQuakeHistoryResponseDto } from '../dtos/quakeHistoryDto';
import { userConverter } from 'src/domain/converters/user';

// Log message constants
const LOG_MESSAGES = {
  REQUEST_PROCESS_QUAKE_HISTORY: 'Requesting process quake history.',
  HISTORY_NOT_FOUND: 'No quake history found.',
  PUT_QUAKE_ID_FAILED: 'Failed to put quakeId.',
};

/**
 * Quake service
 */
@Injectable()
export class QuakeService implements IQuakeService {
  private readonly logger = new Logger(QuakeService.name);

  constructor(
    private readonly p2pQuakeApi: P2pQuakeApi,
    private readonly quakeHistoryRepository: QuakeHistoryRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Process to fetch, save, and notify quake history.
   * @param codes quake history code
   * @param limit Number of returned items
   * @param offset Number of items to skip
   * @returns P2P地震情報 API quake history response Dto
   */
  async processQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<void> {
    this.logger.log(LOG_MESSAGES.REQUEST_PROCESS_QUAKE_HISTORY);

    // Fetch quake history from P2P 地震情報 API.
    const quakeHistory = await this.fetchQuakeHistory(codes, limit, offset);

    // Get current time and convert it to UnixTime.
    const unixTimeNow = convertToUnixTime(getJstTime());

    for (const history of quakeHistory) {
      if (await this.shouldSkipHistory(history, unixTimeNow)) {
        continue;
      }

      // Group points by prefecture.
      const pointsGroupedByPrefecture =
        await this.groupPointsByPrefecture(history);

      const prefectures = Object.keys(pointsGroupedByPrefecture);
      if (prefectures.length === 0) {
        continue;
      }

      const users = await this.userService.getUsersByPrefectures(prefectures);
      if (users.length === 0) {
        continue;
      }

      Promise.all(
        users.map(async (userEntity) => {
          const user = userConverter(userEntity);
        }),
      );

      // pref=prefecture, scale>=threshold_seismic_intensityのユーザーを取得する

      // 配列からユーザーを取り出してLINEに通知する処理を入れる

      await this.saveQuakeId(history.id);
    }
  }

  /**
   * Fetch quake history from P2P 地震情報 API.
   * @param codes quake history code
   * @param limit Number of returned items
   * @param offset Number of items to skip
   * @returns Quake history array
   */
  private async fetchQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<fetchP2pQuakeHistoryResponseDto[]> {
    const quakeHistory = await this.p2pQuakeApi.fetchP2pQuakeHistory(
      codes,
      limit,
      offset,
    );

    if (quakeHistory.length === 0) {
      throw new Error(LOG_MESSAGES.HISTORY_NOT_FOUND);
    }

    return quakeHistory;
  }

  /**
   * Determine if the quake history should be skipped.
   * @param history Quake history object
   * @param unixTimeNow Current Unix time
   * @returns Boolean indicating if the history should be skipped
   */
  private async shouldSkipHistory(
    history: fetchP2pQuakeHistoryResponseDto,
    unixTimeNow: number,
  ): Promise<boolean> {
    if (await isEventTimeValid(unixTimeNow, history.earthquake.time)) {
      return true;
    }

    if (history.earthquake.maxScale < PointsScale.SCALE40) {
      return true;
    }

    if (await this.quakeHistoryRepository.isQuakeIdExists(history.id)) {
      return true;
    }

    return false;
  }

  /**
   * Group points by prefecture.
   * @param history Quake history object
   * @returns Points grouped by prefecture
   */
  private async groupPointsByPrefecture(
    history: fetchP2pQuakeHistoryResponseDto,
  ): Promise<PointsGroupedByPrefecture> {
    const pointsGroupedByPrefecture: PointsGroupedByPrefecture = {};

    if (history.points) {
      history.points
        .filter((point) => point.scale >= PointsScale.SCALE40)
        .forEach((point) => {
          if (!pointsGroupedByPrefecture[point.pref]) {
            pointsGroupedByPrefecture[point.pref] = [];
          }
          pointsGroupedByPrefecture[point.pref].push([
            point.pref,
            point.addr,
            point.scale,
          ]);
        });
    }

    return pointsGroupedByPrefecture;
  }

  /**
   * Save quake ID to the repository.
   * @param quakeId Quake ID
   */
  private async saveQuakeId(quakeId: string): Promise<void> {
    try {
      await this.quakeHistoryRepository.putQuakeId(quakeId);
    } catch (err) {
      this.logger.error(LOG_MESSAGES.PUT_QUAKE_ID_FAILED, err.stack);
      throw err;
    }
  }
}
