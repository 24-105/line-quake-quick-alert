import { Injectable, Logger } from '@nestjs/common';
import { WebhookRequestBody, WebhookEvent } from '@line/bot-sdk';
import { ILineWebhookService } from 'src/domain/interfaces/services/lineWebhookService';

/**
 * LINE Webhook service
 */
@Injectable()
export class LineWebhookService implements ILineWebhookService {
  private readonly logger = new Logger(LineWebhookService.name);

  /**
   * Validate the webhook request body.
   * @param body request body
   * @returns true: valid, false: invalid
   */
  isValidWebhookRequest(body: any): body is WebhookRequestBody {
    return (
      this.isWebhookRequestBody(body) &&
      this.isMatchingDestination(body.destination)
    );
  }

  /**
   * Type guard to check if the body is WebhookRequestBody
   * @param body request body
   * @returns true: WebhookRequestBody, false: not WebhookRequestBody
   */
  private isWebhookRequestBody(body: any): body is WebhookRequestBody {
    return (
      typeof body === 'object' &&
      body !== null &&
      'destination' in body &&
      'events' in body
    );
  }

  /**
   * Check if the request body is valid.
   * @param destination official LINE user id
   * @returns true: valid, false: invalid
   */
  private isMatchingDestination(destination: string): boolean {
    return destination === process.env.LINE_QUALE_QUICK_ALERT_USER_ID;
  }

  /**
   * Process the webhook events.
   * @param events array of webhook events
   */
  async processEvent(events: WebhookEvent[]): Promise<void> {
    for (const event of events) {
      switch (event.type) {
        case 'follow':
          this.logger.log('Follow event received');
          break;
        case 'unfollow':
          this.logger.log('Unfollow event received');
          break;
        case 'message':
          this.logger.log('Message event received');
        default:
          this.logger.log('Unknown event type');
      }
    }
  }
}
