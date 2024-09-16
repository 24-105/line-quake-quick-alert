/**
 * チャンネルアクセストークンリポジトリインターフェース
 */
export interface IChannelAccessTokenRepository {
  putChannelAccessToken(
    channelAccessToken: string,
    keyId: string,
  ): Promise<void>;
}
