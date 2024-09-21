/**
 * Quake batch service interface
 */
export interface IQuakeBatchService {
  fetchQuakeHistoryBatch(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<void>;
}
