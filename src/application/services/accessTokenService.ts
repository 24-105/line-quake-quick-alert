import { Injectable, Logger } from '@nestjs/common';
import * as jose from 'node-jose';
import { LineApiService } from 'src/infrastructure/api/line/lineApiService';
import { getChannelAccessTokenResponseDto } from '../interfaces/dto/channelAccessTokenDto';

/**
 * アクセストークンサービス
 */
@Injectable()
export class AccessTokenService {
  private readonly logger = new Logger(AccessTokenService.name);
  private readonly GENERATE_JWT_LOG = 'Generating JWT';
  private readonly REQUEST_ACCESS_TOKEN_LOG =
    'Requesting channel access token from the LINE Messaging API.';
  private readonly GENERATE_JWT_ERROR_LOG = 'Failed to generate JWT';

  constructor(private readonly lineApiService: LineApiService) {}

  /**
   * JWTを生成する
   * @returns JWT
   */
  async generateJwt(): Promise<string> {
    this.logger.log(this.GENERATE_JWT_LOG);

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
      this.logger.error(this.GENERATE_JWT_ERROR_LOG, err.stack);
      throw err;
    }
  }

  /**
   * チャンネルアクセストークンを取得する
   * @param jwt JWT
   * @returns チャンネルアクセストークン
   */
  async getChannelAccessToken(
    jwt: string,
  ): Promise<getChannelAccessTokenResponseDto> {
    this.logger.log(this.REQUEST_ACCESS_TOKEN_LOG);
    return await this.lineApiService.getChannelAccessToken(jwt);
  }
}
