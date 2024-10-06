import { createPool, Pool } from 'mysql2/promise';
import { Logger } from '@nestjs/common';
import { USERS_TABLE_NAME } from 'src/config/constants';
import { IUserRepository } from 'src/domain/interfaces/repositories/userRepository';

// Log message constants
const LOG_MESSAGES = {
  CHECK_USER_ID_EXISTS: 'Checking if user ID exists: ',
  CHECK_USER_ID_FAILED: 'Failed to check userId: ',
  PUT_USER_ID: 'Putting new user ID: ',
  PUT_USER_ID_FAILED: 'Failed to put userId: ',
  DELETE_USER: 'Deleting user: ',
  DELETE_USER_FAILED: 'Failed to delete user: ',
  UPDATE_USER_PREFECTURE: 'User ID to update prefecture: ',
  UPDATE_USER_PREFECTURE_FAILED: 'Failed to update user prefecture: ',
  UPDATE_USER_SEISMIC_INTENSITY: 'User ID to update seismic intensity: ',
  UPDATE_USER_SEISMIC_INTENSITY_FAILED:
    'Failed to update user seismic intensity: ',
};

/**
 * User repository
 */
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);
  private mysqlClient: Pool;
  private readonly tableName: string;

  constructor() {
    this.mysqlClient = this.createMysqlClient();
    this.tableName = USERS_TABLE_NAME;
  }

  /**
   * Create a MySQL client object.
   */
  private createMysqlClient() {
    return createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
  }

  /**
   * Check if user id exists in the table.
   * @param userId user id
   * @returns true: user id exists, false: user id does not exist
   */
  async isUserIdExists(userId: string): Promise<boolean> {
    this.logger.log(`${LOG_MESSAGES.CHECK_USER_ID_EXISTS}${userId}`);

    try {
      const [rows] = await this.mysqlClient.execute(
        `SELECT * FROM ${USERS_TABLE_NAME} WHERE user_id = ? LIMIT 1;`,
        [userId],
      );
      return rows[0].length > 0;
    } catch (err) {
      this.logger.error(
        `Failed to check if user ID exists: ${userId}`,
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
    this.logger.log(`${LOG_MESSAGES.PUT_USER_ID}${userId}`);

    try {
      await this.mysqlClient.execute(
        `INSERT INTO ${USERS_TABLE_NAME} (user_id) VALUES (?);`,
        [userId],
      );
    } catch (err) {
      this.logger.error(
        `${LOG_MESSAGES.PUT_USER_ID_FAILED}${userId}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Delete user from the table.
   * @param userId user id
   */
  async deleteUser(userId: string): Promise<void> {
    this.logger.log(`${LOG_MESSAGES.DELETE_USER}${userId}`);

    try {
      await this.mysqlClient.execute(
        `DELETE FROM ${USERS_TABLE_NAME} WHERE user_id=?;`,
        [userId],
      );
    } catch (err) {
      this.logger.error(
        `${LOG_MESSAGES.DELETE_USER_FAILED}${userId}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Update user prefecture.
   * @param userId user id
   * @param prefecture prefecture number
   */
  async updateUserPrefecture(
    userId: string,
    prefecture: number,
  ): Promise<void> {
    this.logger.log(`${LOG_MESSAGES.UPDATE_USER_PREFECTURE}${userId}`);

    try {
      await this.mysqlClient.execute(
        `UPDATE ${USERS_TABLE_NAME} SET prefecture=? WHERE user_id=?;`,
        [prefecture, userId],
      );
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
    seismicIntensity: number,
  ): Promise<void> {
    this.logger.log(`${LOG_MESSAGES.UPDATE_USER_SEISMIC_INTENSITY}${userId}`);

    try {
      await this.mysqlClient.execute(
        `UPDATE ${USERS_TABLE_NAME} SET seismic_intensity=? WHERE user_id=?;`,
        [seismicIntensity, userId],
      );
    } catch (err) {
      this.logger.error(
        `${LOG_MESSAGES.UPDATE_USER_SEISMIC_INTENSITY_FAILED}${userId}`,
        err.stack,
      );
      throw err;
    }
  }
}
