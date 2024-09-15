import { fetchQuakeHistoryResponseDto } from 'src/application/dto/quakeHistoryDto';

/**
 * 地震情報サービスインターフェース
 */
export interface IQuakeService {
  fetchQuakeHistory(
    limit?: number,
    offset?: number,
  ): Promise<fetchQuakeHistoryResponseDto[]>;
}
