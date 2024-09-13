import { Controller, Get, Logger } from '@nestjs/common';
import { getChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';

import { AccessTokenService } from 'src/application/services/accessTokenService';

/**
 * LINE認証コントローラー
 */
@Controller('api/v1/line/auth')
export class LineAuthController {
  private readonly logger = new Logger(LineAuthController.name);
  private readonly REQUEST_ACCESS_TOKEN_LOG = 'Requesting access token';
  private readonly GENERATE_JWT_ERROR_LOG = 'Failed to generate JWT';
  private readonly GET_ACCESS_TOKEN_ERROR_LOG =
    'Failed to get channel access token';

  constructor(readonly accessTokenService: AccessTokenService) {}

  /**
   * アクセストークンを取得する
   */
  @Get('accessToken')
  async getChannelAccessToken(): Promise<getChannelAccessTokenResponseDto> {
    this.logger.log(this.REQUEST_ACCESS_TOKEN_LOG);

    let jwt: string;
    try {
      jwt = await this.accessTokenService.generateJwt();
    } catch (err) {
      this.handleError(this.GENERATE_JWT_ERROR_LOG, err);
      throw err;
    }

    try {
      return await this.accessTokenService.getChannelAccessToken(jwt);
    } catch (err) {
      this.handleError(this.GET_ACCESS_TOKEN_ERROR_LOG, err);
      throw err;
    }
  }

  private handleError(message: string, err: any): void {
    this.logger.error(message, err.stack);
    throw err;
  }
}
