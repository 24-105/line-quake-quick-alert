import { Injectable, Logger } from '@nestjs/common';
import { P2pQuakeApiService } from 'src/infrastructure/api/p2pQuake/p2pQuakeApiService';
import { getQuakeHistoryInfoResponseDto } from '../dto/quakeHistoryInfoDto';

/**
 * 地震情報サービスロジック
 */
@Injectable()
export class QuakeService {
  private readonly logger = new Logger(QuakeService.name);
  constructor(private readonly p2pQuakeApiService: P2pQuakeApiService) {}

  /**
   * 地震情報を取得する
   * @param limit 返却件数
   * @param offset 読み飛ばす件数
   * @returns 地震情報DTO
   */
  async fetchQuakeHistoryInfo(
    limit?: number,
    offset?: number,
  ): Promise<getQuakeHistoryInfoResponseDto[]> {
    this.logger.log(`Requesting ${limit} records from the Quake API.`);
    return await this.p2pQuakeApiService.fetchP2pQuakeHistoryInfo(
      limit,
      offset,
    );
  }
}
