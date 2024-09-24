import { WebhookEvent } from '@line/bot-sdk';

/**
 * LINE webhook service interface
 */
export interface ILineWebhookService {
  verifySignature(body: any, signature: string): boolean;
  isWebhookRequestBody(body: any): boolean;
  handleEvents(events: WebhookEvent[]): void;
}
