/**
 * quake history repository interface
 */
export interface IQuakeHistoryRepository {
  checkIfQuakeIDExists(quakeId: string): Promise<boolean>;
}
