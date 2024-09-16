import { Injectable, Logger } from '@nestjs/common';
import { P2pQuakeApiService } from 'src/infrastructure/api/p2pQuake/p2pQuakeApiService';
import { fetchP2pQuakeHistoryResponseDto } from '../dto/p2pQuakeHistoryDto';
import { IQuakeService } from 'src/domain/interfaces/services/quakeService';
import { Cron, CronExpression } from '@nestjs/schedule';
import { convertToUnixTime, getJstTime } from 'src/domain/useCase/dateUseCase';
import { QUAKE_HISTORY_VALID_TIME } from 'src/config/constants';
import { QuakeHistoryRepository } from 'src/infrastructure/persistence/repositories/quakeHistoryRepository';

// ログメッセージ定数
const START_FETCH_QUAKE_HISTORY_BATCH_LOG = 'Start fetch quake history batch';
const REQUEST_FETCH_QUAKE_HISTORY_LOG = 'Requesting fetch quake history';
const HISTORY_NOT_FOUND_LOG = 'No quake history found';
const VERIFY_EVENT_TIME_SUCCESS_LOG = 'Event time is successfully verified';

/**
 * 地震情報サービス
 */
@Injectable()
export class QuakeService implements IQuakeService {
  private readonly logger = new Logger(QuakeService.name);

  constructor(
    private readonly p2pQuakeApiService: P2pQuakeApiService,
    private readonly quakeHistoryRepository: QuakeHistoryRepository,
  ) {}

  /**
   * 地震情報を取得するバッチ
   * @param codes 地震情報コード
   * @param limit 返却件数
   * @param offset 読み飛ばす件数
   * @returns 地震情報DTO
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async fetchQuakeHistoryBatch(): Promise<fetchP2pQuakeHistoryResponseDto[]> {
    this.logger.log(START_FETCH_QUAKE_HISTORY_BATCH_LOG);
    const codes = 551; // 固定引数
    const limit = 1; // 固定引数
    const offset = 0; // 固定引数
    return this.fetchQuakeHistory(codes, limit, offset);
  }

  /**
   * 地震情報を取得する
   * @param codes 地震情報コード
   * @param limit 返却件数
   * @param offset 読み飛ばす件数
   * @returns 地震情報DTO
   */
  async fetchQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<fetchP2pQuakeHistoryResponseDto[]> {
    this.logger.log(REQUEST_FETCH_QUAKE_HISTORY_LOG);

    // P2P地震APIから地震情報を取得
    const quakeHistory = await this.p2pQuakeApiService.fetchP2pQuakeHistory(
      codes,
      limit,
      offset,
    );

    // 地震情報が取得できなかった場合
    if (quakeHistory.length === 0) {
      throw new Error(HISTORY_NOT_FOUND_LOG);
    }

    // 現在時刻を取得
    const jstTimeNow = getJstTime();
    const unixTimeNow = convertToUnixTime(jstTimeNow);

    for (const history of quakeHistory) {
      // 地震の発生時間を検証
      this.logger.log(`Event time is ${history.earthquake.time} verify start`);
      if (await this.verifyEventTime(unixTimeNow, history.earthquake.time)) {
        continue;
      }

      // 地震IDが地震履歴テーブルに存在するか確認
      this.logger.log(`Quake ID ${history.id} check start`);
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
   * 地震の発生時間が現在時刻から閾値以上かどうかを検証
   * @param unixTimeNow 現在時刻のUnixTime
   * @param eventTime 地震の発生時間
   * @returns true: 閾値以上, false: 閾値以内
   */
  private async verifyEventTime(
    unixTimeNow: number,
    eventTime: string,
  ): Promise<boolean> {
    const unixEventTime = convertToUnixTime(eventTime);
    if (unixTimeNow - unixEventTime >= QUAKE_HISTORY_VALID_TIME) {
      this.logger.log(
        `Event time is over ${QUAKE_HISTORY_VALID_TIME} seconds ago`,
      );
      return true;
    }

    this.logger.log(VERIFY_EVENT_TIME_SUCCESS_LOG);
    return false;
  }
}
