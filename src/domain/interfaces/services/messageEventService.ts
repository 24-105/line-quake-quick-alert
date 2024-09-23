import { WebhookEvent } from '@line/bot-sdk';

/**
 * Message event service interface
 */
export interface IMessageEventService {
  handleMessageEvent(event: WebhookEvent): void;
}
