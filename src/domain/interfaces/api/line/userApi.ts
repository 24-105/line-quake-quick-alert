import { UserProfileResponse } from '@line/bot-sdk/dist/messaging-api/model/userProfileResponse';

/**
 * LINE user API interface
 */
export interface IUserApi {
  fetchUserProfile(
    channelAccessToken: string,
    userId: string,
  ): Promise<UserProfileResponse>;
}
