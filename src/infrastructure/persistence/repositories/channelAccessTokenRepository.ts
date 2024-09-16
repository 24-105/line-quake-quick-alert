import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Logger } from '@nestjs/common';
import { IChannelAccessTokenRepository } from 'src/domain/interfaces/repositories/channelAccessTokenRepository';
import { CHANNEL_ACCESS_TOKEN_VALID_TIME } from 'src/config/constants';

// ログメッセージ定数
const PUT_CHANNEL_ACCESS_TOKEN_FAILED_LOG =
  'Failed to put channel access token';

/**
 * チャンネルアクセストークンリポジトリ
 */
export class ChannelAccessTokenRepository
  implements IChannelAccessTokenRepository
{
  private readonly logger = new Logger(ChannelAccessTokenRepository.name);
  private readonly dynamoDbClient: DynamoDBDocumentClient;
  private readonly channelId: string;
  private readonly tableName: string;

  constructor() {
    this.dynamoDbClient = ChannelAccessTokenRepository.createDynamoDbClient();
    this.channelId = process.env.LINE_QUALE_QUICK_ALERT_ISS;
    this.tableName = process.env.CHANNEL_ACCESS_TOKEN_TABLE_NAME;
  }

  /**
   * DynamoDBクライアントを作成する
   * @returns DynamoDBクライアント
   */
  private static createDynamoDbClient(): DynamoDBDocumentClient {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.DYNAMODB_ENDPOINT,
    });
    return DynamoDBDocumentClient.from(client);
  }

  /**
   * チャンネルアクセストークンを保存する
   * @param channelAccessToken
   * @param keyId
   */
  async putChannelAccessToken(
    channelAccessToken: string,
    keyId: string,
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        channelId: this.channelId,
        channelAccessToken: channelAccessToken,
        keyId: keyId,
        TTL: CHANNEL_ACCESS_TOKEN_VALID_TIME,
      },
    };
    try {
      await this.dynamoDbClient.send(new PutCommand(params));
    } catch (err) {
      this.logger.error(PUT_CHANNEL_ACCESS_TOKEN_FAILED_LOG, err.stack);
      throw err;
    }
  }
}
