/**
 * Quake service interface
 */
export interface IQuakeService {
  fetchQuakeHistory(
    codes: number,
    limit: number,
    offset: number,
  ): Promise<void>;
}
