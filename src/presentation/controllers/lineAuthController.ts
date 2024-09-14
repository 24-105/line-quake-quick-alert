import { Controller, Get, Logger } from '@nestjs/common';
import { fetchChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';

import { AccessTokenService } from 'src/application/services/accessTokenService';

/**
 * LINE認証コントローラー
 */
@Controller('api/v1/line/auth')
export class LineAuthController {
  private readonly logger = new Logger(LineAuthController.name);
  private readonly REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_LOG =
    'Requesting fetch channel access token';
  private readonly GENERATE_JWT_ERROR_LOG = 'Failed to generate JWT';
  private readonly REQUEST_SUCCESS_LOG =
    'Channel access token successfully fetched';
  private readonly REQUEST_ERROR_LOG = 'Failed to fetch channel access token';

  constructor(readonly accessTokenService: AccessTokenService) {}

  /**
   * アクセストークンを取得する
   */
  @Get('accessToken')
  async fetchChannelAccessToken(): Promise<fetchChannelAccessTokenResponseDto> {
    this.logger.log(this.REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_LOG);

    let jwt: string;
    try {
      jwt = await this.accessTokenService.generateJwt();
    } catch (err) {
      this.logger.error(this.GENERATE_JWT_ERROR_LOG, err.stack);
      throw err;
    }

    try {
      const response =
        await this.accessTokenService.fetchChannelAccessToken(jwt);
      this.logger.log(this.REQUEST_SUCCESS_LOG);
      return response;
    } catch (err) {
      this.logger.error(this.REQUEST_ERROR_LOG, err.stack);
      throw err;
    }
  }
}
