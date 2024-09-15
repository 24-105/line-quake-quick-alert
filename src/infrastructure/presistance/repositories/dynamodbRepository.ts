import { IDynamodbRepository } from 'src/domain/interfaces/repositories/dynamodbRepository';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Logger } from '@nestjs/common';

/**
 * AWS DynamoDBリポジトリ
 */
export class DynamodbRepository implements IDynamodbRepository {
  private readonly logger = new Logger(DynamodbRepository.name);
  private readonly dynamoDbClient: DynamoDBDocumentClient;
  private readonly tableName: string;
  private readonly CHECK_QUAKE_ID_ERROR_LOG =
    'Failed to fetch quake history quakeID';

  constructor() {
    this.dynamoDbClient = this.createDynamoDbClient();
    this.tableName = process.env.QUAKE_HISTORY_TABLE_NAME;
  }

  /**
   * DynamoDBクライアントを作成する
   * @returns DynamoDBクライアント
   */
  private createDynamoDbClient(): DynamoDBDocumentClient {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.DYNAMODB_ENDPOINT,
    });
    return DynamoDBDocumentClient.from(client);
  }

  /**
   * 地震IDが地震履歴テーブルに存在するか確認
   * @param quakeID 地震ID
   * @returns true: 存在する, false: 存在しない
   */
  async checkIfQuakeIDExists(quakeID: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: { quakeID: quakeID },
    };
    try {
      const result = await this.dynamoDbClient.send(new GetCommand(params));
      if (result.Item) {
        this.logger.log(`Quake ID ${quakeID} exists in the table`);
        return true;
      }
      this.logger.log(`Quake ID ${quakeID} does not exist in the table`);
      return false;
    } catch (err) {
      this.logger.error(
        `${this.CHECK_QUAKE_ID_ERROR_LOG}: ${quakeID}`,
        err.stack,
      );
      throw err;
    }
  }
}
