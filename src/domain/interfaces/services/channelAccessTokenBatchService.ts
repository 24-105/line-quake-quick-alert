/**
 * Channel access token batch service interface
 */
export interface IChannelAccessTokenBatchService {
  processChannelAccessTokenBatch(): Promise<void>;
}
