/**
 * 地震情報リポジトリインターフェース
 */
export interface IQuakeHistoryRepository {
  checkIfQuakeIDExists(quakeId: string): Promise<boolean>;
}
