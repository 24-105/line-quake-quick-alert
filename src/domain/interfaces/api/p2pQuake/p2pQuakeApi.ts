import { fetchP2pQuakeHistoryResponseDto } from 'src/application/dtos/quakeHistoryDto';

/**
 * P2P地震情報 API interface
 */
export interface IP2pQuakeApi {
  fetchP2pQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<fetchP2pQuakeHistoryResponseDto[]>;
}
