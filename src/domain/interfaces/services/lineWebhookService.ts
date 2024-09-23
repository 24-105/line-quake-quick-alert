import { WebhookEvent } from '@line/bot-sdk';

/**
 * LINE webhook service interface
 */
export interface ILineWebhookService {
  isValidWebhookRequest(body: any): Promise<boolean>;
  handleEvents(events: WebhookEvent[]): void;
}
