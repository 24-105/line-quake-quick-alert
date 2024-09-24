/**
 * Interface for the user service.
 */
export interface IUserService {
  ensureUserIdExists(userId: string): Promise<void>;
}
