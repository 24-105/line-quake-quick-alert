import { WebhookEvent } from '@line/bot-sdk';
import { Injectable, Logger } from '@nestjs/common';
import { RESPONSE_MESSAGE_TRIGGER } from 'src/config/constants';
import { IMessageEventService } from 'src/domain/interfaces/services/messageEventService';
import { isMessageEvent, isTextMessage } from 'src/domain/useCase/webhookEvent';
import { MessageApi } from 'src/infrastructure/api/line/messageApi';
import { UserApi } from 'src/infrastructure/api/line/userApi';
import { ChannelAccessTokenService } from './channelAccessTokenService';
import { createContactTextMessage } from 'src/domain/useCase/textMessage';
import { UserService } from './userService';

// Log message constants
const LOG_MESSAGES = {
  NOT_MESSAGE_EVENT: 'This is not a MessageEvent.',
  MESSAGE_TYPE_NOT_SUPPORTED: 'Message types not supported.',
  TEXT_NOT_SUPPORTED: 'Text not supported.',
  HANDLING_WHERE_YOU_LIVE: 'Handling where you live.',
  HANDLING_QUAKE_SEISMIC_INTENSITY: 'Handling quake seismic intensity.',
  HANDLING_CONTACT_ME_BY_CHAT: 'Handling contact me by chat.',
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
    private readonly userService: UserService,
    private readonly channelAccessTokenService: ChannelAccessTokenService,
    private readonly userApi: UserApi,
    private readonly messageApi: MessageApi,
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
      this.logger.log(
        LOG_MESSAGES.MESSAGE_TYPE_NOT_SUPPORTED,
        event.message.type,
      );
      return;
    }

    // Handle text message.
    const text = event.message.text;
    if (RESPONSE_MESSAGE_TRIGGER.WHERE_YOU_LIVE_REGEX.test(text)) {
      console.log(text);
      await this.handleWhereYouLive(event.source.userId);
      return;
    }

    if (RESPONSE_MESSAGE_TRIGGER.QUAKE_SEISMIC_INTENSITY_REGEX.test(text)) {
      console.log(text);
      await this.handleQuakeSeismicIntensity();
      return;
    }

    if (RESPONSE_MESSAGE_TRIGGER.CONTACT_ME_BY_CHAT_REGEX.test(text)) {
      await this.handleContactMeByChat(event.source.userId);
      return;
    }

    this.logger.log(LOG_MESSAGES.TEXT_NOT_SUPPORTED, text);
  }

  /**
   * Handle where you live.
   */
  private async handleWhereYouLive(userId: string): Promise<void> {
    await this.userService.ensureUserIdExists(userId);

    this.logger.log(LOG_MESSAGES.HANDLING_WHERE_YOU_LIVE);
  }

  /**
   * Handle quake seismic intensity.
   */
  private async handleQuakeSeismicIntensity(): Promise<void> {
    this.logger.log(LOG_MESSAGES.HANDLING_QUAKE_SEISMIC_INTENSITY);
  }

  /**
   * Handle contact me by chat.
   * @param userId user id
   */
  private async handleContactMeByChat(userId: string): Promise<void> {
    this.logger.log(LOG_MESSAGES.HANDLING_CONTACT_ME_BY_CHAT);
    try {
      const channelAccessToken =
        await this.channelAccessTokenService.getChannelAccessToken();

      const userProfile = await this.userApi.fetchUserProfile(
        channelAccessToken,
        userId,
      );

      const message = await createContactTextMessage(userProfile.displayName);

      await this.messageApi.pushMessage(channelAccessToken, userId, [message]);
      this.logger.log(LOG_MESSAGES.HANDLING_CONTACT_ME_BY_CHAT_SUCCESS);
    } catch (err) {
      this.logger.error(
        LOG_MESSAGES.HANDLING_CONTACT_ME_BY_CHAT_FAILED,
        err.stack,
      );
      throw err;
    }
  }
}
