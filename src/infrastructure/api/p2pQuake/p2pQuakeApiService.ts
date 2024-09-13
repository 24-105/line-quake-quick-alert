import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { getQuakeHistoryInfoResponseDto } from 'src/application/dto/quakeHistoryInfoDto';

/**
 * P2P地震APIサービス
 */
@Injectable()
export class P2pQuakeApiService {
  private readonly logger = new Logger(P2pQuakeApiService.name);
  constructor(private readonly httpService: HttpService) {}

  /**
   * 地震情報をP2P APIから取得する
   * https://www.p2pquake.net/develop/json_api_v2/#/P2P%E5%9C%B0%E9%9C%87%E6%83%85%E5%A0%B1%20API/get_history
   * @param limit 返却件数(default: 10)
   * @param offset 読み飛ばす件数(default: 0)
   * @returns 地震情報DTO
   */
  async fetchP2pQuakeHistoryInfo(
    limit?: number,
    offset?: number,
  ): Promise<getQuakeHistoryInfoResponseDto[]> {
    const url = 'https://api.p2pquake.net/v2/history';
    const code = 551;
    const params = {
      codes: code,
      limit: limit,
      offset: offset,
    };
    try {
      this.logger.log(`Fetching ${limit} earthquake records.`);
      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );
      return response.data;
    } catch (err) {
      this.logger.error('Failed to fetch earthquake data.', err.stack);
      throw err;
    }
  }
}
