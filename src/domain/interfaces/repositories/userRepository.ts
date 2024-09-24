/**
 * user repository interface
 */
export interface IUserRepository {
  isUserIdExists(userId: string): Promise<boolean>;
  putUserId(userId: string): Promise<void>;
}
