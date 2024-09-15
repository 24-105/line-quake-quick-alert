import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { fetchQuakeHistoryInfoResponseDto } from 'src/application/dto/quakeHistoryInfoDto';

/**
 * P2P地震APIサービス
 */
@Injectable()
export class P2pQuakeApiService {
  private readonly logger = new Logger(P2pQuakeApiService.name);
  private readonly REQUEST_QUAKE_HISTORY_INFO_LOG =
    'Fetching quake history info from the P2P Quake API';
  private readonly FETCH_QUAKE_HISTORY_ERROR_LOG =
    'Failed to fetch quake history info';

  constructor(private readonly httpService: HttpService) {}

  /**
   * 地震情報をP2P APIから取得する
   * https://www.p2pquake.net/develop/json_api_v2/#/P2P%E5%9C%B0%E9%9C%87%E6%83%85%E5%A0%B1%20API/get_history
   * @param limit 返却件数(default: 10)
   * @param offset 読み飛ばす件数(default: 0)
   * @returns 地震情報DTO
   */
  async fetchP2pQuakeHistoryInfo(
    limit: number = 3,
    offset?: number,
  ): Promise<fetchQuakeHistoryInfoResponseDto[]> {
    const url = 'https://api.p2pquake.net/v2/history';
    const code = 551;
    const params = {
      codes: code,
      limit: limit,
      offset: offset,
    };

    try {
      this.logger.log(`${this.REQUEST_QUAKE_HISTORY_INFO_LOG}`);
      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );
      return response.data;
    } catch (err) {
      this.logger.error(`${this.FETCH_QUAKE_HISTORY_ERROR_LOG}`, err.stack);
      throw err;
    }
  }
}
