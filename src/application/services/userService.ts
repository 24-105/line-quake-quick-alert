import { Injectable, Logger } from '@nestjs/common';
import { PointsScale } from 'src/domain/enum/quakeHistory/pointsEnum';
import { IUserService } from 'src/domain/interfaces/services/userService';
import { convertPrefectureToEnum } from 'src/domain/useCase/prefecture';
import { convertSeismicIntensityEnum } from 'src/domain/useCase/seismicIntensity';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';

// Log message constants
const LOG_MESSAGES = {
  ENSURE_USER_ID_EXISTS: 'Ensuring user ID exists: ',
  CHECK_USER_ID_EXISTS: 'Checking if user ID exists: ',
  ADD_USER_ID: 'Adding new user ID: ',
};

/**
 * User service
 */
@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Ensure user id exists.
   * @param userId user id
   */
  async ensureUserIdExists(userId: string): Promise<void> {
    this.logger.log(`${LOG_MESSAGES.ENSURE_USER_ID_EXISTS}${userId}`);
    const isValidUser = await this.checkUserIdExists(userId);

    if (!isValidUser) {
      await this.addUserId(userId);
    }
  }

  /**
   * Update user's prefecture.
   * @param userId user id
   * @param prefecture prefecture
   */
  async updateUserPrefecture(
    userId: string,
    prefecture: string,
  ): Promise<void> {
    await this.userRepository.updateUserPrefecture(
      userId,
      convertPrefectureToEnum(prefecture),
    );
  }

  /**
   * Update user's seismic intensity.
   * @param userId user id
   * @param seismicIntensity seismic intensity
   */
  async updateUserSeismicIntensity(
    userId: string,
    seismicIntensity: string,
  ): Promise<void> {
    await this.userRepository.updateUserSeismicIntensity(
      userId,
      convertSeismicIntensityEnum(seismicIntensity) ?? PointsScale.SCALE40,
    );
  }

  /**
   * Check if user id exists.
   * @param userId user id
   * @returns true: user id exists, false: user id does not exist
   */
  private async checkUserIdExists(userId: string): Promise<boolean> {
    this.logger.log(`${LOG_MESSAGES.CHECK_USER_ID_EXISTS}${userId}`);
    return await this.userRepository.isUserIdExists(userId);
  }

  /**
   * Add user id.
   * @param userId user id
   */
  private async addUserId(userId: string): Promise<void> {
    this.logger.log(`${LOG_MESSAGES.ADD_USER_ID}${userId}`);
    await this.userRepository.putUserId(userId);
  }
}
