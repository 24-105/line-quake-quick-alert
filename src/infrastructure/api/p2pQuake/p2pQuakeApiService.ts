import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  FetchP2pQuakeHistoryRequestDto,
  fetchQuakeHistoryResponse,
} from 'src/application/dto/quakeHistoryDto';
import { IP2pQuakeApiService } from 'src/domain/interfaces/api/p2pQuakeApiService';

/**
 * P2P地震情報APIサービス
 */
@Injectable()
export class P2pQuakeApiService implements IP2pQuakeApiService {
  private readonly logger = new Logger(P2pQuakeApiService.name);
  private readonly REQUEST_QUAKE_HISTORY_LOG =
    'Fetching quake history from the P2P Quake API';
  private readonly FETCH_QUAKE_HISTORY_ERROR_LOG =
    'Failed to fetch quake history';

  constructor(private readonly httpService: HttpService) {}

  /**
   * 地震情報をP2P地震情報APIから取得する
   * https://www.p2pquake.net/develop/json_api_v2/#/P2P%E5%9C%B0%E9%9C%87%E6%83%85%E5%A0%B1%20API/get_history
   * @param codes 地震情報コード
   * @param limit 返却件数
   * @param offset 読み飛ばす件数
   * @returns 地震情報DTO
   */
  async fetchP2pQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<fetchQuakeHistoryResponse[]> {
    // リクエストパラメータを作成
    const params = this.createParams(codes, limit, offset);

    // P2P地震情報APIから地震情報を取得
    try {
      this.logger.log(`${this.REQUEST_QUAKE_HISTORY_LOG}`);
      const response = await firstValueFrom(
        this.httpService.get(process.env.P2P_GET_QUAKE_HISTORY_URL, { params }),
      );
      return response.data;
    } catch (err) {
      this.logger.error(`${this.FETCH_QUAKE_HISTORY_ERROR_LOG}`, err.stack);
      throw err;
    }
  }

  /**
   * HTTPリクエストのパラメータを作成する
   * @param code 地震情報コード
   * @param limit 返却件数
   * @param offset 読み飛ばす件数
   * @returns P2P地震情報取得APIリクエストDTO
   */
  private createParams(
    codes: number,
    limit: number,
    offset: number,
  ): FetchP2pQuakeHistoryRequestDto {
    return {
      codes: codes,
      limit: limit,
      offset: offset,
    };
  }
}
