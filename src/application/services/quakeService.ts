import { Injectable, Logger } from '@nestjs/common';
import { P2pQuakeApiService } from 'src/infrastructure/api/p2pQuake/p2pQuakeApiService';
import { fetchQuakeHistoryInfoResponseDto } from '../dto/quakeHistoryInfoDto';
import { IQuakeService } from 'src/domain/interfaces/services/quakeService';

/**
 * 地震情報サービスロジック
 */
@Injectable()
export class QuakeService implements IQuakeService {
  private readonly logger = new Logger(QuakeService.name);
  private readonly REQUEST_FETCH_QUAKE_HISTORY_LOG =
    'Requesting fetch quake history';

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
  ): Promise<fetchQuakeHistoryInfoResponseDto[]> {
    this.logger.log(`${this.REQUEST_FETCH_QUAKE_HISTORY_LOG}`);
    return await this.p2pQuakeApiService.fetchP2pQuakeHistoryInfo(
      limit,
      offset,
    );
  }
}
