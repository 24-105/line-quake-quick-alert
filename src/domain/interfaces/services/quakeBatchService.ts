/**
 * Quake batch service interface
 */
export interface IQuakeBatchService {
  processQuakeHistoryBatch(): Promise<void>;
}
