import { WebhookEvent } from '@line/bot-sdk';
import { Injectable, Logger } from '@nestjs/common';
import { RESPONSE_MESSAGE_TRIGGER } from 'src/config/constants';
import { IMessageEventService } from 'src/domain/interfaces/services/messageEventService';
import { getJstTime } from 'src/domain/useCase/date';
import { isMessageEvent, isTextMessage } from 'src/domain/useCase/webhookEvent';
import { ChannelAccessTokenApi } from 'src/infrastructure/api/line/channelAccessTokenApi';
import { MessageApi } from 'src/infrastructure/api/line/messageApi';
import { UserApi } from 'src/infrastructure/api/line/userApi';
import { ChannelAccessTokenRepository } from 'src/infrastructure/persistence/repositories/channelAccessTokenRepository';
import { ChannelAccessTokenService } from './channelAccessTokenService';

// Log message constants
const LOG_MESSAGES = {
  NOT_MESSAGE_EVENT: 'This is not a MessageEvent.',
  MESSAGE_TYPE_NOT_SUPPORTED: 'Message types not supported.',
  TEXT_NOT_SUPPORTED: 'Text not supported.',
  HANDLING_CONTACT_ME_BY_CHAT_SUCCESS: 'Handling contact me by chat success.',
  HANDLING_CONTACT_ME_BY_CHAT_FAILED: 'Handling contact me by chat failed.',
};

/**
 * Message event service
 */
@Injectable()
export class MessageEventService implements IMessageEventService {
  private readonly logger = new Logger(MessageEventService.name);

  constructor(
    private readonly channelAccessTokenService: ChannelAccessTokenService,
    private readonly userApi: UserApi,
    private readonly messageApi: MessageApi,
    private readonly channelAccessTokenApi: ChannelAccessTokenApi,
    private readonly channelAccessTokenRepository: ChannelAccessTokenRepository,
  ) {}

  /**
   * Handle message event.
   * @param event event object
   */
  async handleMessageEvent(event: WebhookEvent): Promise<void> {
    if (!isMessageEvent(event)) {
      this.logger.error(LOG_MESSAGES.NOT_MESSAGE_EVENT, event.type);
      return;
    }

    if (!isTextMessage(event.message)) {
      this.logger.warn(
        LOG_MESSAGES.MESSAGE_TYPE_NOT_SUPPORTED,
        event.message.type,
      );
      return;
    }

    // Handle text message.
    const text = event.message.text;
    switch (text) {
      case RESPONSE_MESSAGE_TRIGGER.WHERE_YOU_LIVE:
      case RESPONSE_MESSAGE_TRIGGER.QUAKE_SEISMIC_INTENSITY:
        console.log('Hello!');
        break;
      case RESPONSE_MESSAGE_TRIGGER.CONTACT_ME_BY_CHAT:
        await this.handleContactMeByChat(event);
        break;
      default:
        this.logger.log(LOG_MESSAGES.TEXT_NOT_SUPPORTED, text);
    }
  }

  /**
   * Get channel access token.
   * @returns channel access token
   */
  private async getChannelAccessToken(): Promise<string> {
    const channelAccessToken =
      await this.channelAccessTokenRepository.getChannelAccessToken(
        process.env.LINE_QUALE_QUICK_ALERT_ADMIN_ISS,
      );

    const isValidToken =
      await this.channelAccessTokenApi.verifyChannelAccessToken(
        channelAccessToken,
      );
    if (isValidToken) {
      return channelAccessToken;
    }

    await this.channelAccessTokenService.processChannelAccessToken();
    return await this.channelAccessTokenRepository.getChannelAccessToken(
      process.env.LINE_QUALE_QUICK_ALERT_ADMIN_ISS,
    );
  }

  /**
   * Handle contact me by chat.
   * @param event event object
   */
  private async handleContactMeByChat(event: WebhookEvent): Promise<void> {
    try {
      const channelAccessToken = await this.getChannelAccessToken();

      const userProfile = await this.userApi.fetchUserProfile(
        channelAccessToken,
        event.source.userId,
      );

      const message = this.createContactMessage(userProfile.displayName);

      await this.messageApi.pushMessage(
        channelAccessToken,
        event.source.userId,
        [message],
      );
      this.logger.log(LOG_MESSAGES.HANDLING_CONTACT_ME_BY_CHAT_SUCCESS);
    } catch (err) {
      this.logger.error(
        LOG_MESSAGES.HANDLING_CONTACT_ME_BY_CHAT_FAILED,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Create contact message.
   * @param displayName User display name
   * @returns Contact message
   */
  private createContactMessage(displayName: string): string {
    return `管理者各位、${getJstTime()}に${displayName}様からお問い合わせがありました。`;
  }
}
