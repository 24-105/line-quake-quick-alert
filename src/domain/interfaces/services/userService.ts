/**
 * Interface for the user service.
 */
export interface IUserService {
  ensureUserIdExists(userId: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  updateUserPrefecture(userId: string, prefecture: string): Promise<void>;
  updateUserSeismicIntensity(
    userId: string,
    seismicIntensity: string,
  ): Promise<void>;
}
