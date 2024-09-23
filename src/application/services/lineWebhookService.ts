import { Injectable, Logger } from '@nestjs/common';
import { WebhookEvent } from '@line/bot-sdk';
import { ILineWebhookService } from 'src/domain/interfaces/services/lineWebhookService';
import { MessageEventService } from './messageEventService';
import { isWebhookRequestBody } from 'src/domain/useCase/webhookEvent';
import { isMatchingDestination } from 'src/domain/useCase/matchingDestination';

// Log message constants
const LOG_MESSAGES = {
  EVENT_TYPE_NOT_SUPPORTED: 'Event types not supported.',
};

/**
 * LINE webhook service
 */
@Injectable()
export class LineWebhookService implements ILineWebhookService {
  private readonly logger = new Logger(LineWebhookService.name);

  constructor(private readonly messageEventService: MessageEventService) {}

  /**
   * Validate the webhook request body.
   * @param body request body
   * @returns
   */
  async isValidWebhookRequest(body: any): Promise<boolean> {
    return (
      (await isWebhookRequestBody(body)) &&
      (await isMatchingDestination(body.destination))
    );
  }

  /**
   * Handle webhook events.
   * @param events array of webhook events
   */
  handleEvents(events: WebhookEvent[]): void {
    for (const event of events) {
      this.handleEvent(event);
    }
  }

  /**
   * Handle a single webhook event.
   * @param event webhook event
   */
  private handleEvent(event: WebhookEvent): void {
    switch (event.type) {
      case 'message':
        this.messageEventService.handleMessageEvent(event);
        break;
      case 'follow':
        break;
      case 'unfollow':
        break;
      default:
        this.logger.warn(LOG_MESSAGES.EVENT_TYPE_NOT_SUPPORTED, event.type);
    }
  }
}
