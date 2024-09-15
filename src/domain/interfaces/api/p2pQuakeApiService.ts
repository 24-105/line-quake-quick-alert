import { fetchQuakeHistoryResponse } from 'src/application/dto/quakeHistoryDto';

/**
 * P2P地震APIサービスインターフェース
 */
export interface IP2pQuakeApiService {
  fetchP2pQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<fetchQuakeHistoryResponse[]>;
}
