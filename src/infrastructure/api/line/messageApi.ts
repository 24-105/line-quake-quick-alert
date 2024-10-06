import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LINE_API_PUSH_MESSAGE_URL } from 'src/config/constants';
import { IMessageApi } from 'src/domain/interfaces/api/line/messageApi';
import { createAuthRetryHeaders } from 'src/domain/useCase/http';

// Log message constants
const LOG_MESSAGES = {
  REQUEST_PUSH_MESSAGE:
    'Requesting to push a message via the LINE Messaging API.',
  POST_PUSH_MESSAGE_FAILED:
    'Failed to post push message via the LINE Messaging API.',
};

/**
 * LINE Message API
 */
@Injectable()
export class MessageApi implements IMessageApi {
  private readonly logger = new Logger(MessageApi.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Push message to the channel.
   * @param to ID of the target recipient
   * @param messages list of messages
   */
  async pushMessage(
    channelAccessToken: string,
    to: string,
    messages: { type: string; text: string }[],
  ): Promise<void> {
    this.logger.log(LOG_MESSAGES.REQUEST_PUSH_MESSAGE);

    const url = LINE_API_PUSH_MESSAGE_URL;
    const headers = createAuthRetryHeaders(channelAccessToken);
    const body = this.createRequestBody(to, messages);

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers }),
      );
      if (response.status == 409) {
        throw new Error(response.data.message);
      }
    } catch (err) {
      this.logger.error(LOG_MESSAGES.POST_PUSH_MESSAGE_FAILED, err.stack);
      throw err;
    }
  }

  /**
   * Create request body for the push message.
   * @param to ID of the target recipient
   * @param messages List of messages
   * @returns Request body object
   */
  private createRequestBody(
    to: string,
    messages: { type: string; text: string }[],
  ) {
    return {
      to,
      messages,
    };
  }
}
