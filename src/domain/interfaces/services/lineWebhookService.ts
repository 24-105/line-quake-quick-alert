import { WebhookEvent, WebhookRequestBody } from '@line/bot-sdk';

/**
 * LINE Webhook service interface
 */
export interface ILineWebhookService {
  isValidWebhookRequest(body: any): body is WebhookRequestBody;
  processEvent(events: WebhookEvent[]): Promise<void>;
}
