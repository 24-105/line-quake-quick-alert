import { Injectable, Logger } from '@nestjs/common';
import { IChannelAccessTokenService } from 'src/domain/interfaces/services/channelAccessTokenService';
import { ChannelAccessTokenRepository } from 'src/infrastructure/persistence/repositories/channelAccessTokenRepository';
import { generateJwt } from 'src/domain/useCase/jwt';
import { ChannelAccessTokenApi } from 'src/infrastructure/api/line/channelAccessTokenApi';
import * as fs from 'fs';
import * as path from 'path';

// Log message constants
const LOG_MESSAGES = {
  REQUEST_PROCESS_CHANNEL_ACCESS_TOKEN:
    'Requesting process channel access token.',
  GENERATE_JWT: 'Trying to generate JWT.',
  GENERATE_ADMIN_JWT: 'Trying to generate admin JWT.',
  GENERATE_JWT_FAILED: 'Failed to generate JWT.',
  GENERATE_JWT_ADMIN_FAILED: 'Failed to generate admin JWT.',
  FETCH_CHANNEL_ACCESS_TOKEN: 'Trying to fetch channel access token.',
  FETCH_CHANNEL_ACCESS_TOKEN_SUCCESS:
    'Successfully fetched channel access token.',
  FETCH_CHANNEL_ACCESS_TOKEN_FAILED: 'Failed to fetch channel access token.',
  UPDATE_CHANNEL_ACCESS_TOKEN_SUCCESS:
    'Successfully updated channel access token.',
  UPDATE_CHANNEL_ACCESS_TOKEN_FAILED: 'Failed to update channel access token.',
};

/**
 * Channel access token service
 */
@Injectable()
export class ChannelAccessTokenService implements IChannelAccessTokenService {
  private readonly logger = new Logger(ChannelAccessTokenService.name);

  constructor(
    private readonly channelAccessTokenApi: ChannelAccessTokenApi,
    private readonly channelAccessTokenRepository: ChannelAccessTokenRepository,
  ) {}

  /**
   * Process channel access token.
   */
  async processChannelAccessToken(): Promise<void> {
    this.logger.log(LOG_MESSAGES.REQUEST_PROCESS_CHANNEL_ACCESS_TOKEN);

    // read private key file
    const privateKey = this.readKeyFile('key/private.key');
    const adminPrivateKey = this.readKeyFile('key/admin-private.key');

    try {
      const jwtList = await this.generateJwts(privateKey, adminPrivateKey);
      await this.updateChannelAccessTokens(jwtList);
      this.logger.log(LOG_MESSAGES.UPDATE_CHANNEL_ACCESS_TOKEN_SUCCESS);
    } catch (err) {
      this.logger.error(
        LOG_MESSAGES.UPDATE_CHANNEL_ACCESS_TOKEN_FAILED,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Generate JWTs for both regular and admin.
   * @param privateKey Private key
   * @param adminPrivateKey Admin private key
   * @returns List of JWTs
   */
  private async generateJwts(
    privateKey: string,
    adminPrivateKey: string,
  ): Promise<{ jwt: string; iss: string }[]> {
    const jwtList = [];

    try {
      this.logger.log(LOG_MESSAGES.GENERATE_JWT);
      const jwt = await generateJwt(
        privateKey,
        process.env.LINE_QUALE_QUICK_ALERT_KID,
        process.env.LINE_QUALE_QUICK_ALERT_ISS,
        process.env.LINE_QUALE_QUICK_ALERT_SUB,
      );
      jwtList.push({ jwt, iss: process.env.LINE_QUALE_QUICK_ALERT_ISS });
    } catch (err) {
      this.logger.error(LOG_MESSAGES.GENERATE_JWT_FAILED, err.stack);
      throw err;
    }

    try {
      this.logger.log(LOG_MESSAGES.GENERATE_ADMIN_JWT);
      const jwt = await generateJwt(
        adminPrivateKey,
        process.env.LINE_QUALE_QUICK_ALERT_ADMIN_KID,
        process.env.LINE_QUALE_QUICK_ALERT_ADMIN_ISS,
        process.env.LINE_QUALE_QUICK_ALERT_ADMIN_SUB,
      );
      jwtList.push({ jwt, iss: process.env.LINE_QUALE_QUICK_ALERT_ADMIN_ISS });
    } catch (err) {
      this.logger.error(LOG_MESSAGES.GENERATE_JWT_ADMIN_FAILED, err.stack);
      throw err;
    }

    return jwtList;
  }

  /**
   * Update channel access tokens using the generated JWTs.
   * @param jwtList List of JWTs
   */
  private async updateChannelAccessTokens(
    jwtList: { jwt: string; iss: string }[],
  ): Promise<void> {
    for (const { jwt, iss } of jwtList) {
      try {
        const tokenResponse =
          await this.channelAccessTokenApi.fetchChannelAccessToken(jwt);

        await this.channelAccessTokenRepository.putChannelAccessToken(
          iss,
          tokenResponse.access_token,
          tokenResponse.key_id,
        );
        this.logger.log(LOG_MESSAGES.FETCH_CHANNEL_ACCESS_TOKEN_SUCCESS);
      } catch (err) {
        this.logger.error(
          LOG_MESSAGES.FETCH_CHANNEL_ACCESS_TOKEN_FAILED,
          err.stack,
        );
        throw err;
      }
    }
  }

  /**
   * Read private key file.
   * @param fileName private key file name
   * @returns private key
   */
  private readKeyFile(relativeFilePath: string): string {
    const filePath = path.join(process.cwd(), relativeFilePath);
    return fs.readFileSync(filePath, 'utf8');
  }
}
