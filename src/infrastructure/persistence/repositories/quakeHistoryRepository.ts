import { IQuakeHistoryRepository } from 'src/domain/interfaces/repositories/quakeHitoryRepository';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Logger } from '@nestjs/common';

// Log message constants
const CHECK_QUAKE_ID_FAILED_LOG = 'Failed to fetch quake history quakeID.';

/**
 * Quake history repository
 */
export class QuakeHistoryRepository implements IQuakeHistoryRepository {
  private readonly logger = new Logger(QuakeHistoryRepository.name);
  private readonly dynamoDbClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    this.dynamoDbClient = QuakeHistoryRepository.createDynamoDbClient();
    this.tableName = process.env.QUAKE_HISTORY_TABLE_NAME;
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
   * Check if the quake ID exists in the table.
   * @param quakeID quake ID
   * @returns true: quake ID exists, false: quake ID does not exist
   */
  async checkIfQuakeIDExists(quakeID: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: { quakeID: quakeID },
    };
    try {
      const result = await this.dynamoDbClient.send(new GetCommand(params));
      if (result.Item) {
        this.logger.log(`Quake ID ${quakeID} exists in the table.`);
        return true;
      }
      this.logger.log(`Quake ID ${quakeID} does not exist in the table.`);
      return false;
    } catch (err) {
      this.logger.error(`${CHECK_QUAKE_ID_FAILED_LOG}: ${quakeID}`, err.stack);
      throw err;
    }
  }
}
