/**
 * Quake service interface
 */
export interface IQuakeService {
  processQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<void>;
}
