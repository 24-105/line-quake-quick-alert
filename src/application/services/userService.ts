import { Injectable, Logger } from '@nestjs/common';
import { PointsScale } from 'src/domain/enum/quakeHistory/pointsEnum';
import { IUserService } from 'src/domain/interfaces/services/userService';
import { convertPrefectureToEnum } from 'src/domain/useCase/prefecture';
import { convertSeismicIntensityEnum } from 'src/domain/useCase/seismicIntensity';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { EncryptionService } from './encryptionService';

// Log message constants
const LOG_MESSAGES = {
  ENSURE_USER_ID_EXISTS: 'Ensuring user ID exists: ',
};

/**
 * User service
 */
@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  /**
   * Ensure user id exists.
   * @param userId user id
   */
  async ensureUserIdExists(userId: string): Promise<void> {
    this.logger.log(`${LOG_MESSAGES.ENSURE_USER_ID_EXISTS}${userId}`);

    const encryptedUserId = await this.encryptionService.encrypt(userId);
    const isValidUser =
      await this.userRepository.isUserIdExists(encryptedUserId);

    if (!isValidUser) {
      await this.userRepository.putUserId(userId);
    }
  }

  /**
   * Delete user.
   * @param userId user id
   */
  async deleteUser(userId: string): Promise<void> {
    const encryptedUserId = await this.encryptionService.encrypt(userId);
    await this.userRepository.deleteUser(encryptedUserId);
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
    const encryptedUserId = await this.encryptionService.encrypt(userId);
    await this.userRepository.updateUserPrefecture(
      encryptedUserId,
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
    const encryptedUserId = await this.encryptionService.encrypt(userId);
    await this.userRepository.updateUserSeismicIntensity(
      encryptedUserId,
      convertSeismicIntensityEnum(seismicIntensity) ?? PointsScale.SCALE40,
    );
  }
}
