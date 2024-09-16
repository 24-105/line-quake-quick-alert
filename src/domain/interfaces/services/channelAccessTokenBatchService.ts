/**
 * チャンネルアクセストークンバッチサービスインターフェース
 */
export interface IChannelAccessTokenBatchService {
  updateChannelAccessTokenBatch(): Promise<void>;
}
