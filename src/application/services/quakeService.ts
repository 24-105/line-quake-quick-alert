import { Injectable, Logger } from '@nestjs/common';
import { P2pQuakeApiService } from 'src/infrastructure/api/p2pQuake/p2pQuakeApiService';
import { fetchQuakeHistoryResponse } from '../dto/quakeHistoryDto';
import { IQuakeService } from 'src/domain/interfaces/services/quakeService';
import { Cron, CronExpression } from '@nestjs/schedule';
import { convertToUnixTime, getJstTime } from 'src/domain/useCase/dateUseCase';
import { DynamodbRepository } from 'src/infrastructure/presistance/repositories/dynamodbRepository';
import { QUAKE_HISTORY_VALID_TIME } from 'src/config/constants';

/**
 * 地震情報サービス
 */
@Injectable()
export class QuakeService implements IQuakeService {
  private readonly logger = new Logger(QuakeService.name);
  private readonly REQUEST_FETCH_QUAKE_HISTORY_LOG =
    'Requesting fetch quake history';
  private readonly HISTORY_NOT_FOUND_ERROR_LOG = 'No quake history found';
  private readonly VERIFY_EVENT_TIME_SUCCESS_LOG =
    'Event time is successfully verified';

  constructor(
    private readonly p2pQuakeApiService: P2pQuakeApiService,
    private readonly dynamodbRepository: DynamodbRepository,
  ) {}

  /**
   * 地震履歴を取得するバッチ
   * @param codes 地震情報コード
   * @param limit 返却件数
   * @param offset 読み飛ばす件数
   * @returns 地震履歴DTO
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async fetchQuakeHistoryBatch(): Promise<fetchQuakeHistoryResponse[]> {
    const codes = 551; // 固定引数
    const limit = 1; // 固定引数
    const offset = 0; // 固定引数
    return this.fetchQuakeHistory(codes, limit, offset);
  }

  /**
   * 地震履歴を取得する
   * @param codes 地震情報コード
   * @param limit 返却件数
   * @param offset 読み飛ばす件数
   * @returns 地震履歴DTO
   */
  async fetchQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<fetchQuakeHistoryResponse[]> {
    this.logger.log(`${this.REQUEST_FETCH_QUAKE_HISTORY_LOG}`);

    // P2P地震APIから地震履歴を取得
    const quakeHistory = await this.p2pQuakeApiService.fetchP2pQuakeHistory(
      codes,
      limit,
      offset,
    );

    // 地震情報が取得できなかった場合
    if (quakeHistory.length === 0) {
      this.logger.error(this.HISTORY_NOT_FOUND_ERROR_LOG);
      return [];
    }

    // 地震情報の最新履歴を取得
    const history = quakeHistory[0];

    // 現在時刻を取得
    const jstTimeNow = getJstTime();
    const unixTimeNow = convertToUnixTime(jstTimeNow);

    // 地震の発生時間を検証
    this.logger.log(`Event time is ${history.earthquake.time} verify start`);
    if (await this.verifyEventTime(unixTimeNow, history.earthquake.time)) {
      return quakeHistory;
    }

    // 地震IDが地震履歴テーブルに存在するか確認
    this.logger.log(`Quake ID ${history.id} check start`);
    const idExists = await this.dynamodbRepository.checkIfQuakeIDExists(
      history.id,
    );
    if (idExists) {
      return quakeHistory;
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

    this.logger.log(this.VERIFY_EVENT_TIME_SUCCESS_LOG);
    return false;
  }
}
