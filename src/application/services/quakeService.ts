import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { getQuakeHistoryInfoResponseDto } from '../interfaces/dto/quakeHistoryInfoDto';

/**
 * 地震情報サービスロジック
 */
@Injectable()
export class QuakeService {
  private readonly logger = new Logger(QuakeService.name);
  constructor(private readonly httpService: HttpService) {}

  async fetchQuake(
    limit?: number,
    offset?: number,
  ): Promise<AxiosResponse<getQuakeHistoryInfoResponseDto>> {
    const url = 'https://api.p2pquake.net/v2/history';
    const code = 551;
    const params = {
      codes: code,
      limit: limit || 1,
      offset: offset || 0,
    };
    try {
      this.logger.log(`地震情報を${limit}件取得します。`);
      return await firstValueFrom(this.httpService.get(url, { params }));
    } catch (err) {
      this.logger.error('地震情報の取得に失敗しました。', err.stack);
      throw err;
    }
  }
}
