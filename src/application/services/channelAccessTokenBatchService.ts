import { Injectable, Logger } from '@nestjs/common';
import * as jose from 'node-jose';
import { fetchChannelAccessTokenResponseDto } from '../dto/channelAccessTokenDto';
import { LineMessagingApiService } from 'src/infrastructure/api/line/lineMessagingApiService';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IChannelAccessTokenBatchService } from 'src/domain/interfaces/services/channelAccessTokenBatchService';
import { ChannelAccessTokenRepository } from 'src/infrastructure/persistence/repositories/channelAccessTokenRepository';

// ログメッセージ定数
const START_UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_LOG =
  'Start update channel access token batch';
const GENERATE_JWT_LOG = 'Trying to generate JWT';
const GENERATE_JWT_FAILED_LOG = 'Failed to generate JWT';
const FETCH_CHANNEL_ACCESS_TOKEN_LOG = 'Trying to fetch channel access token';
const FETCH_CHANNEL_ACCESS_TOKEN_FAILED_LOG =
  'Failed to fetch channel access token';
const UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_SUCCESS_LOG =
  'Successfully updated channel access token';
const UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_FAILED_LOG =
  'Failed to update channel access token';

/**
 * チャンネルアクセストークンバッチサービス
 */
@Injectable()
export class ChannelAccessTokenBatchService
  implements IChannelAccessTokenBatchService
{
  private readonly logger = new Logger(ChannelAccessTokenBatchService.name);

  constructor(
    private readonly lineMessagingApiService: LineMessagingApiService,
    private readonly channelAccessTokenRepository: ChannelAccessTokenRepository,
  ) {}

  /**
   * チャンネルアクセストークンを更新するバッチ
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateChannelAccessTokenBatch(): Promise<void> {
    this.logger.log(START_UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_LOG);

    try {
      const jwt = await this.generateJwt();
      const tokenResponse = await this.fetchChannelAccessTokenWithJwt(jwt);
      this.logger.log(FETCH_CHANNEL_ACCESS_TOKEN_LOG);

      await this.channelAccessTokenRepository.putChannelAccessToken(
        tokenResponse.access_token,
        tokenResponse.key_id,
      );
      this.logger.log(UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_SUCCESS_LOG);
    } catch (err) {
      this.logger.error(
        UPDATE_CHANNEL_ACCESS_TOKEN_BATCH_FAILED_LOG,
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
    try {
      return await this.lineMessagingApiService.fetchChannelAccessToken(jwt);
    } catch (err) {
      this.logger.error(FETCH_CHANNEL_ACCESS_TOKEN_FAILED_LOG, err.stack);
      throw err;
    }
  }
}
