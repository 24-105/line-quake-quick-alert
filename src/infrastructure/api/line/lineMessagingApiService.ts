import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { URLSearchParams } from 'url';
import { fetchChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';
import { ILineMessagingApiService } from 'src/domain/interfaces/api/lineMessagingApiService';

// Log message constants
const REQUEST_CHANNEL_ACCESS_TOKEN_LOG =
  'Requesting channel access token from the LINE Messaging API.';
const FETCH_ACCESS_TOKEN_FAILED_LOG = 'Failed to fetch channel access token.';

/**
 * LINE Messaging API service
 */
@Injectable()
export class LineMessagingApiService implements ILineMessagingApiService {
  private readonly logger = new Logger(LineMessagingApiService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Fetch channel access token from LINE Messaging API.
   * https://developers.line.biz/ja/reference/messaging-api/#issue-channel-access-token-v2-1
   * @param jwt JWT
   * @returns channel access token
   */
  async fetchChannelAccessToken(
    jwt: string,
  ): Promise<fetchChannelAccessTokenResponseDto> {
    this.logger.log(REQUEST_CHANNEL_ACCESS_TOKEN_LOG);

    const url = 'https://api.line.me/oauth2/v2.1/token';
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append(
      'client_assertion_type',
      'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    );
    params.append('client_assertion', jwt);

    try {
      return await firstValueFrom(
        this.httpService.post(url, params.toString(), { headers }),
      ).then((response) => response.data);
    } catch (err) {
      this.logger.error(FETCH_ACCESS_TOKEN_FAILED_LOG, err.stack);
      throw err;
    }
  }
}
