import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { URLSearchParams } from 'url';
import { getChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';
import { ILineMessagingApiService } from 'src/domain/interfaces/api/lineApiService';

/**
 * LINE Messaging APIサービス
 */
@Injectable()
export class LineMessagingApiService implements ILineMessagingApiService {
  private readonly logger = new Logger(LineMessagingApiService.name);
  private readonly REQUEST_ACCESS_TOKEN_LOG =
    'Requesting channel access token from the LINE Messaging API.';
  private readonly GET_ACCESS_TOKEN_ERROR_LOG =
    'Failed to get channel access token';

  constructor(private readonly httpService: HttpService) {}

  /**
   * チャンネルアクセストークンを取得する
   * https://developers.line.biz/ja/reference/messaging-api/#issue-channel-access-token-v2-1
   * @param jwt JWT
   * @returns チャンネルアクセストークン
   */
  async getChannelAccessToken(
    jwt: string,
  ): Promise<getChannelAccessTokenResponseDto> {
    const url = 'https://api.line.me/oauth2/v2.1/token';
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append(
      'client_assertion_type',
      'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    );
    params.append('client_assertion', jwt);

    this.logger.log(this.REQUEST_ACCESS_TOKEN_LOG);

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, params.toString(), { headers }),
      );
      return response.data;
    } catch (err) {
      this.logger.error(this.GET_ACCESS_TOKEN_ERROR_LOG, err.stack);
      throw err;
    }
  }
}
