import { IQuakeHistoryRepository } from 'src/domain/interfaces/repositories/quakeHitoryRepository';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Logger } from '@nestjs/common';
import {
  QUAKE_HISTORY_TABLE_NAME,
  QUAKE_ID_VALID_TIME,
} from 'src/config/constants';

// Log message constants
const CHECK_QUAKE_ID_FAILED_LOG = 'Failed to fetch quake history quakeId.';
const PUT_QUAKE_ID_FAILED_LOG = 'Failed to put quakeId.';

/**
 * Quake history repository
 */
export class QuakeHistoryRepository implements IQuakeHistoryRepository {
  private readonly logger = new Logger(QuakeHistoryRepository.name);
  private readonly dynamoDbClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    this.dynamoDbClient = QuakeHistoryRepository.createDynamoDbClient();
    this.tableName = QUAKE_HISTORY_TABLE_NAME;
  }

  /**
   * Create an Amazon DynamoDB service client object.
   * @returns DynamoDB service client object
   */
  private static createDynamoDbClient(): DynamoDBDocumentClient {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.DYNAMODB_ENDPOINT,
    });
    return DynamoDBDocumentClient.from(client);
  }

  /**
   * Check if quake id exists in the table.
   * @param quakeId quake id
   * @returns true: quake id exists, false: quake id does not exist
   */
  async isQuakeIdExists(quakeId: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: { quakeId: quakeId },
    };
    try {
      const result = await this.dynamoDbClient.send(new GetCommand(params));
      if (result.Item) {
        return true;
      }
      return false;
    } catch (err) {
      this.logger.error(`${CHECK_QUAKE_ID_FAILED_LOG}: ${quakeId}`, err.stack);
      throw err;
    }
  }

  /**
   * Put quake id in the table.
   * @param quakeId quake id
   */
  async putQuakeId(quakeId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        quakeId: quakeId,
        TTL: QUAKE_ID_VALID_TIME,
      },
    };
    try {
      await this.dynamoDbClient.send(new PutCommand(params));
    } catch (err) {
      this.logger.error(PUT_QUAKE_ID_FAILED_LOG, err.stack);
      throw err;
    }
  }
}
