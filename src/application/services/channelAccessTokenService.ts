import { Injectable, Logger } from '@nestjs/common';
import * as jose from 'node-jose';
import { fetchChannelAccessTokenResponseDto } from '../dto/channelAccessTokenDto';
import { LineMessagingApiService } from 'src/infrastructure/api/line/lineMessagingApiService';
import { IChannelAccessTokenService } from 'src/domain/interfaces/services/channelAccessTokenService';

// ログメッセージ定数
const REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_LOG =
  'Requesting fetch channel access token';
const REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_FAILED_LOG =
  'Failed to fetch channel access token';
const GENERATE_JWT_FAILED_LOG = 'Failed to generate JWT';
const GENERATE_JWT_LOG = 'Trying to generate JWT';

/**
 * チャンネルアクセストークンサービス
 */
@Injectable()
export class ChannelAccessTokenService implements IChannelAccessTokenService {
  private readonly logger = new Logger(ChannelAccessTokenService.name);

  constructor(
    private readonly lineMessagingApiService: LineMessagingApiService,
  ) {}

  /**
   * チャンネルアクセストークンを取得する
   * @returns チャンネルアクセストークン
   */
  async fetchChannelAccessToken(): Promise<fetchChannelAccessTokenResponseDto> {
    this.logger.log(REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_LOG);
    try {
      const jwt = await this.generateJwt();
      return this.fetchChannelAccessTokenWithJwt(jwt);
    } catch (err) {
      this.logger.error(
        REQUEST_FETCH_CHANNEL_ACCESS_TOKEN_FAILED_LOG,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * JWTを生成する
   * @returns JWT
   */
  private async generateJwt(): Promise<string> {
    this.logger.log(GENERATE_JWT_LOG);

    const privateKey = process.env.LINE_QUALE_QUICK_ALERT_SECRET_KEY;

    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: process.env.LINE_QUALE_QUICK_ALERT_KID,
    };

    const payload = {
      iss: process.env.LINE_QUALE_QUICK_ALERT_ISS,
      sub: process.env.LINE_QUALE_QUICK_ALERT_SUB,
      aud: 'https://api.line.me/',
      exp: Math.floor(new Date().getTime() / 1000) + 60 * 30,
      token_exp: 60 * 60 * 24 * 30,
    };

    try {
      return await jose.JWS.createSign(
        { format: 'compact', fields: header },
        JSON.parse(privateKey),
      )
        .update(JSON.stringify(payload))
        .final();
    } catch (err) {
      this.logger.error(GENERATE_JWT_FAILED_LOG, err.stack);
      throw err;
    }
  }

  /**
   * JWTを使用してチャンネルアクセストークンを取得する
   * @param jwt JWT
   * @returns チャンネルアクセストークン
   */
  private async fetchChannelAccessTokenWithJwt(
    jwt: string,
  ): Promise<fetchChannelAccessTokenResponseDto> {
    return await this.lineMessagingApiService.fetchChannelAccessToken(jwt);
  }
}
