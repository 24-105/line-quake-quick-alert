import { Controller, Get, Logger } from '@nestjs/common';
import { fetchChannelAccessTokenResponseDto } from 'src/application/dto/channelAccessTokenDto';
import { ChannelAccessTokenService } from 'src/application/services/channelAccessTokenService';

// ログメッセージ定数
const REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_LOG =
  'Requesting fetch channel access token';
const FETCH_CHANNEL_ACCESS_TOKEN_SUCCESS_LOG =
  'Channel access token successfully fetched';
const FETCH_CHANNEL_ACCESS_TOKEN_FAILED_LOG =
  'Failed to fetch channel access token';

/**
 * LINE認証コントローラー
 */
@Controller('api/v1/line/auth')
export class LineAuthController {
  private readonly logger = new Logger(LineAuthController.name);

  constructor(readonly channelAccessTokenService: ChannelAccessTokenService) {}

  /**
   * チャンネルアクセストークンを取得する
   * @returns チャンネルアクセストーク
   */
  @Get('channelAccessToken')
  async fetchChannelAccessToken(): Promise<fetchChannelAccessTokenResponseDto> {
    this.logger.log(REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_LOG);

    try {
      const response =
        await this.channelAccessTokenService.fetchChannelAccessToken();
      this.logger.log(FETCH_CHANNEL_ACCESS_TOKEN_SUCCESS_LOG);
      return response;
    } catch (err) {
      this.logger.error(FETCH_CHANNEL_ACCESS_TOKEN_FAILED_LOG, err.stack);
      throw err;
    }
  }
}
