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
import {
  extractPrefectureName,
  extractSeismicIntensity,
} from 'src/domain/useCase/extractText';

// Log message constants
const LOG_MESSAGES = {
  NOT_MESSAGE_EVENT: 'This is not a MessageEvent.',
  MESSAGE_TYPE_NOT_SUPPORTED: 'Message types not supported.',
  TEXT_NOT_SUPPORTED: 'Text not supported.',
  HANDLING_WHERE_YOU_LIVE: 'Handling where you live.',
  HANDLING_WHERE_YOU_LIVE_SUCCESS: 'Successfully Handling where you live.',
  HANDLING_WHERE_YOU_LIVE_FAILED: 'Failed to handling where you live.',
  HANDLING_QUAKE_SEISMIC_INTENSITY: 'Handling quake seismic intensity.',
  HANDLING_QUAKE_SEISMIC_INTENSITY_SUCCESS:
    'Successfully Handling quake seismic intensity.',
  HANDLING_QUAKE_SEISMIC_INTENSITY_FAILED:
    'Failed to handling quake seismic intensity.',
  HANDLING_CONTACT_ME_BY_CHAT: 'Handling contact me by chat.',
  HANDLING_CONTACT_ME_BY_CHAT_SUCCESS:
    'Successfully Handling contact me by chat.',
  HANDLING_CONTACT_ME_BY_CHAT_FAILED: 'Failed to handling contact me by chat.',
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
      await this.handleWhereYouLive(event.source.userId, text);
      return;
    }

    if (RESPONSE_MESSAGE_TRIGGER.QUAKE_SEISMIC_INTENSITY_REGEX.test(text)) {
      await this.handleQuakeSeismicIntensity(event.source.userId, text);
      return;
    }

    if (RESPONSE_MESSAGE_TRIGGER.CONTACT_ME_BY_CHAT_REGEX.test(text)) {
      await this.handleContactMeByChat(event.source.userId, text);
      return;
    }

    this.logger.log(LOG_MESSAGES.TEXT_NOT_SUPPORTED, text);
  }

  /**
   * Handle where you live.
   * @param userId user id
   * @param text received text
   */
  private async handleWhereYouLive(
    userId: string,
    text: string,
  ): Promise<void> {
    this.logger.log(`${LOG_MESSAGES.HANDLING_WHERE_YOU_LIVE}: ${text}`);
    await this.userService.ensureUserIdExists(userId);

    try {
      const prefectureName = extractPrefectureName(text);
      if (prefectureName) {
        await this.userService.updateUserPrefecture(userId, prefectureName);
        this.logger.log(LOG_MESSAGES.HANDLING_WHERE_YOU_LIVE_SUCCESS);
      } else {
        this.logger.error(
          `${LOG_MESSAGES.HANDLING_WHERE_YOU_LIVE_FAILED}: ${text}`,
        );
      }
    } catch (err) {
      this.logger.error(
        `${LOG_MESSAGES.HANDLING_WHERE_YOU_LIVE_FAILED}: ${text}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Handle quake seismic intensity.
   * @param userId user id
   * @param text received text
   */
  private async handleQuakeSeismicIntensity(
    userId: string,
    text: string,
  ): Promise<void> {
    this.logger.log(
      `${LOG_MESSAGES.HANDLING_QUAKE_SEISMIC_INTENSITY}: ${text}`,
    );
    await this.userService.ensureUserIdExists(userId);

    try {
      const seismicIntensity = extractSeismicIntensity(text);
      if (seismicIntensity) {
        await this.userService.updateUserSeismicIntensity(
          userId,
          seismicIntensity,
        );
        this.logger.log(LOG_MESSAGES.HANDLING_QUAKE_SEISMIC_INTENSITY_SUCCESS);
      } else {
        this.logger.error(
          `${LOG_MESSAGES.HANDLING_QUAKE_SEISMIC_INTENSITY_FAILED}: ${text}`,
        );
      }
    } catch (err) {
      this.logger.error(
        `${LOG_MESSAGES.HANDLING_QUAKE_SEISMIC_INTENSITY_FAILED}: ${text}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Handle contact me by chat.
   * @param userId user id
   * @param text received text
   */
  private async handleContactMeByChat(
    userId: string,
    text: string,
  ): Promise<void> {
    this.logger.log(`${LOG_MESSAGES.HANDLING_CONTACT_ME_BY_CHAT}: ${text}`);
    await this.userService.ensureUserIdExists(userId);

    try {
      const channelAccessToken =
        await this.channelAccessTokenService.getLatestChannelAccessToken();

      const userProfile = await this.userApi.fetchUserProfile(
        channelAccessToken,
        userId,
      );

      const message = await createContactTextMessage(userProfile.displayName);

      await this.messageApi.pushMessage(channelAccessToken, userId, [message]);
      this.logger.log(LOG_MESSAGES.HANDLING_CONTACT_ME_BY_CHAT_SUCCESS);
    } catch (err) {
      this.logger.error(
        `${LOG_MESSAGES.HANDLING_CONTACT_ME_BY_CHAT_FAILED}: ${text}`,
        err.stack,
      );
      throw err;
    }
  }
}
