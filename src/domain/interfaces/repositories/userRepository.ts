/**
 * user repository interface
 */
export interface IUserRepository {
  isUserIdExists(userId: string): Promise<boolean>;
  putUserId(userId: string): Promise<void>;
  updateUserPrefecture(userId: string, prefecture: number): Promise<void>;
  updateUserSeismicIntensity(
    userId: string,
    seismicIntensity: number,
  ): Promise<void>;
}
