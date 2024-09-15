import { fetchP2pQuakeHistoryResponseDto } from 'src/application/dto/quakeHistoryDto';

/**
 * 地震情報サービスインターフェース
 */
export interface IQuakeService {
  fetchQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<fetchP2pQuakeHistoryResponseDto[]>;
}
