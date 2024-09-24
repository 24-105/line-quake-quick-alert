import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Logger } from '@nestjs/common';
import { USERS_TABLE_NAME } from 'src/config/constants';
import { IUserRepository } from 'src/domain/interfaces/repositories/userRepository';

// Log message constants
const LOG_MESSAGES = {
  CHECK_USER_ID_FAILED: 'Failed to check userId: ',
  PUT_USER_ID_FAILED: 'Failed to put userId: ',
  UPDATE_USER_PREFECTURE_FAILED: 'Failed to update user prefecture: ',
  UPDATE_USER_SEISMIC_INTENSITY_FAILED:
    'Failed to update user seismic intensity: ',
};

/**
 * User repository
 */
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);
  private readonly dynamoDbClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    this.dynamoDbClient = this.createDynamoDbClient();
    this.tableName = USERS_TABLE_NAME;
  }

  /**
   * Create an Amazon DynamoDB service client object.
   * @returns DynamoDB service client object
   */
  private createDynamoDbClient(): DynamoDBDocumentClient {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.DYNAMODB_ENDPOINT,
    });
    return DynamoDBDocumentClient.from(client);
  }

  /**
   * Check if user id exists in the table.
   * @param userId user id
   * @returns true: user id exists, false: user id does not exist
   */
  async isUserIdExists(userId: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: { userId: userId },
    };

    try {
      const result = await this.dynamoDbClient.send(new GetCommand(params));
      return !!result.Item;
    } catch (err) {
      this.logger.error(
        `${LOG_MESSAGES.CHECK_USER_ID_FAILED}${userId}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Put user id in the table.
   * @param userId user id
   */
  async putUserId(userId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        userId: userId,
      },
    };

    try {
      await this.dynamoDbClient.send(new PutCommand(params));
    } catch (err) {
      this.logger.error(
        `${LOG_MESSAGES.PUT_USER_ID_FAILED}${userId}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Update user prefecture.
   * @param userId user id
   * @param prefecture prefecture name
   */
  async updateUserPrefecture(
    userId: string,
    prefecture: string,
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { userId: userId },
      UpdateExpression: 'set prefecture = :prefecture',
      ExpressionAttributeValues: {
        ':prefecture': prefecture,
      },
      ConditionExpression: 'attribute_exists(userId)',
    };

    try {
      await this.dynamoDbClient.send(new UpdateCommand(params));
    } catch (err) {
      this.logger.error(
        `${LOG_MESSAGES.UPDATE_USER_PREFECTURE_FAILED}${userId}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Update user seismic intensity.
   * @param userId user id
   * @param seismicIntensity seismic intensity
   */
  async updateUserSeismicIntensity(
    userId: string,
    seismicIntensity: string,
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { userId: userId },
      UpdateExpression: 'set seismicIntensity = :seismicIntensity',
      ExpressionAttributeValues: {
        ':seismicIntensity': seismicIntensity,
      },
      ConditionExpression: 'attribute_exists(userId)',
    };

    try {
      await this.dynamoDbClient.send(new UpdateCommand(params));
    } catch (err) {
      this.logger.error(
        `${LOG_MESSAGES.UPDATE_USER_SEISMIC_INTENSITY_FAILED}${userId}`,
        err.stack,
      );
      throw err;
    }
  }
}
