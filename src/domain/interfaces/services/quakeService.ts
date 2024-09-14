import { fetchQuakeHistoryInfoResponseDto } from 'src/application/dto/quakeHistoryInfoDto';

/**
 * 地震情報サービスインターフェース
 */
export interface IQuakeService {
  fetchQuakeHistoryInfo(
    limit?: number,
    offset?: number,
  ): Promise<fetchQuakeHistoryInfoResponseDto[]>;
}
