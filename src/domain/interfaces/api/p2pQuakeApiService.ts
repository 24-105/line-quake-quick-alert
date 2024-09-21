import { fetchP2pQuakeHistoryResponseDto } from 'src/application/dto/quakeHistoryDto';

/**
 * P2P地震 API service interface
 */
export interface IP2pQuakeApiService {
  fetchP2pQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<fetchP2pQuakeHistoryResponseDto[]>;
}
