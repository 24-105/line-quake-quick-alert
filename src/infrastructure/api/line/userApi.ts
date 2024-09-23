import { UserProfileResponse } from '@line/bot-sdk/dist/messaging-api/model/userProfileResponse';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { LINE_API_GET_USER_PROFILE_URL } from 'src/config/constants';
import { IUserApi } from 'src/domain/interfaces/api/line/userApi';

// Log message constants
const LOG_MESSAGES = {
  REQUEST_USER_PROFILE: 'Requesting user profile from the LINE Messaging API.',
  FETCH_USER_PROFILE_FAILED: 'Failed to fetch user profile.',
};

/**
 * LINE user API
 */
@Injectable()
export class UserApi implements IUserApi {
  private readonly logger = new Logger(UserApi.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Fetch user profile from LINE Messaging API.
   * https://developers.line.biz/ja/reference/messaging-api/#get-profile
   * @param userId User Id
   * @returns user profile
   */
  async fetchUserProfile(
    channelAccessToken: string,
    userId: string,
  ): Promise<UserProfileResponse> {
    this.logger.log(LOG_MESSAGES.REQUEST_USER_PROFILE);

    const url = this.createUrl(userId);
    const headers = this.createHeaders(channelAccessToken);

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );
      return response.data;
    } catch (err) {
      this.logger.error(LOG_MESSAGES.FETCH_USER_PROFILE_FAILED, err.stack);
      throw err;
    }
  }

  /**
   * Create URL for the request.
   * @param userId User Id
   * @returns URL string
   */
  private createUrl(userId: string): string {
    return `${LINE_API_GET_USER_PROFILE_URL}/${userId}`;
  }

  /**
   * Create headers for the request.
   * @param channelAccessToken Channel access token
   * @returns Headers object
   */
  private createHeaders(channelAccessToken: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${channelAccessToken}`,
    };
  }
}
