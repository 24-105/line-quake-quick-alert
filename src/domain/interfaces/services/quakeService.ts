import { fetchP2pQuakeHistoryResponseDto } from 'src/application/dto/quakeHistoryDto';

/**
 * Quake service interface
 */
export interface IQuakeService {
  fetchQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<fetchP2pQuakeHistoryResponseDto[]>;
}
