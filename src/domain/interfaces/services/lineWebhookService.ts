import { WebhookEvent } from '@line/bot-sdk';

/**
 * LINE webhook service interface
 */
export interface ILineWebhookService {
  verifySignature(body: any, signature: string): boolean;
  handleEvents(events: WebhookEvent[]): void;
}
